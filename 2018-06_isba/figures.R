library(tidyverse)
library(ggplot2)
library(dbplyr)
library(RSQLite)
library(ggmap)

gtfs.db <- "~/Documents/uni/TransitNetworkModel/gtfs.db"
gtfs <- dbConnect(SQLite(), gtfs.db)

shapeid <- gtfs %>% tbl("routes") %>% select(shape_id, route_id) %>%
    filter(route_id %like% "27401%") %>%
    head(1) %>% collect %>% pluck('shape_id')
shape <- gtfs %>% tbl("shapes") %>%
    filter(shape_id == shapeid) %>% arrange(seq) %>% collect

dbDisconnect(gtfs)

shp <- shape %>% filter(between(dist_traveled, 2700, 4000))
xr = extendrange(shp$lng, f = 2) 
yr = extendrange(shp$lat)
bbox = c(xr[1], yr[1], xr[2], yr[2])
akl = get_stamenmap(bbox, zoom = 16, maptype = "toner-hybrid")

map <- ggmap(akl) +
    geom_path(aes(lng, lat), data = shape, color = "skyblue2",
              alpha = 0.9, lwd = 2) +
    theme(axis.text = element_blank(), 
          axis.ticks = element_blank(),
          panel.grid.major = element_blank()) + xlab("") + ylab("")
#map


bearing <- function(a, b) {
    ## convert to radians!!
    lam.a <- a[1] * pi / 180
    lam.b <- b[1] * pi / 180
    phi.a <- a[2] * pi / 180
    phi.b <- b[2] * pi / 180
    th.rad <- atan2(sin(lam.b - lam.a) * cos(phi.b),
                    cos(phi.a) * sin(phi.b) - sin(phi.a) * cos(phi.b) * cos(lam.b - lam.a))
    (th.rad * 180 / pi) %% 360
}

partialSegment <- function(x, theta, d, R = 6371000) {
    ## Compute the Lat/Lon after traveling distance D
    ## from point X at a bearing of THETA
    
    delta <- d / R ## for single calculation
    theta <- theta * pi / 180  ## convert to radians
    phi.s <- x[2] * pi / 180
    lam.s <- x[1] * pi / 180
    
    phi.z <- asin(sin(phi.s) * cos(delta) + cos(phi.s) * sin(delta) * cos(theta))
    lam.z <- lam.s + atan2(sin(theta) * sin(delta) * cos(phi.s),
                           cos(delta) - sin(phi.s) * sin(phi.z))
    c(phi.z, lam.z) * 180 / pi
}
h <- function(d, sh) {
    i <- which(sh$dist_traveled > d)[1]
    if (sh$dist_traveled[i-1] == d) return(c(sh$lat[i-1], sh$lng[i-1]))
    a <- c(sh$lng[i-1], sh$lat[i-1])
    b <- c(sh$lng[i], sh$lat[i])
    theta <- bearing(a, b)
    partialSegment(a, theta, d - sh$dist_traveled[i-1])
}


p <- dget("particles.dat") %>% as.tibble
T <- unique(p$timestamp)

set.seed(2)
dobs <- 3300
Yobs <- h(dobs, shape) + rnorm(2, 0, 0.0001)


### Graph 1: begin state, time t_{k-1}
## filter out duplicates
p1 <- p %>% filter(k == 1 & between(t, T[1], T[2]))

set.seed(1)
pids <- p1 %>% filter(d < 2820) %>% pluck('particle_id') %>%
    unique %>% sample(10)

p1f <- p1 %>% filter(particle_id %in% pids)
x1 <- ggplot(p1f %>% filter(t == T[1])) +
    geom_point(aes(t, d), col = "orangered", size = 3, pch = 19) +
    xlim(T[1], T[2]) + #ylim(min(p1f$d), max(p1f$d)) +
    xlab("") + ylab("") + ylim(2700, 4000) +
    theme(axis.text = element_blank(),
          axis.ticks = element_blank()) +
    geom_vline(xintercept = T[2], lty = 2, colour = "red")


dx1 <- sapply(p1f %>% filter(t == T[1]) %>% pluck('d'), h, sh = shape) %>%
    t %>% as.tibble %>% mutate(lat = V1, lng = V2) %>% select(lat, lng)
m1 <- map + geom_point(aes(lng, lat), data = dx1, colour = "orangered",
                       size = 2, stroke = 2, pch = 21, fill = "white") +
    geom_point(aes(x = Yobs[2], y = Yobs[1]), pch = 4, colour = "red",
               size = 1.5, stroke = 2)
#gridExtra::grid.arrange(x1, m1, ncol = 2, widths = c(3, 1))

### Graph 2: transition particles forward to time t_k
x2 <- x1 + geom_path(aes(t, d, group = particle_id),
                     data = p1f, lty = 2) +
    geom_point(aes(t, d), data = p1f %>% filter(t == T[2]),
               size = 1.5, pch = 19)

dx2 <- sapply(p1f %>% filter(t == T[2]) %>% pluck('d'), h, sh = shape) %>%
    t %>% as.tibble %>%
    mutate(id = p1f %>% filter(t == T[2]) %>% pluck('particle_id'),
           lat = V1, lng = V2) %>%
    select(id, lat, lng)
m2 <- map +
    geom_point(aes(lng, lat), data = dx2, colour = "black", size = 2, stroke = 2,
               pch = 21, fill = "white") +
    geom_point(aes(x = Yobs[2], y = Yobs[1]), pch = 4, colour = "red",
               size = 1.5, stroke = 2)
#gridExtra::grid.arrange(x2, m2, ncol = 2, widths = c(3, 1))

### Graph 3: resample with replacement
ll <- dnorm(p1f %>% filter(t == T[2]) %>% pluck("d"), dobs, 20)
wt <- ll / sum(ll)

idk <- sample(p1f$particle_id %>% unique, prob = wt, replace = TRUE)

p3 <- p1f %>% mutate(keep = ifelse(particle_id %in% idk, "yes", "no"))
x3 <- x1 + geom_path(aes(t, d, group = particle_id, colour = keep,
                         lty = keep),
               data = p3) +
    scale_colour_manual(values = c("yes" = "orangered", "no" = "gray")) +
    scale_linetype_manual(values = c("yes" = 1, "no" = 2)) +
    geom_point(aes(t, d, colour = keep, size = keep),
               data = p3 %>% filter(t == T[2])) +
    scale_size_manual(values = c("yes" = 3, "no" = 1)) +
    theme(legend.position = 'none')

dx3 <- dx2 %>% mutate(keep = ifelse(id %in% idk, "yes", "no"))
m3 <- map +
    geom_point(aes(lng, lat, colour = keep),
               data = dx3 %>% arrange((keep)),
               size = 2, stroke = 2, pch = 21, fill = "white") +
    scale_colour_manual(values = c("yes" = "orangered", "no" = "gray")) +
    theme(legend.position = "none")
#gridExtra::grid.arrange(x3, m3, ncol = 2, widths = c(3, 1))


#gridExtra::grid.arrange(x1, m1, x2, m2, x3, m3,
#                        layout_matrix = rbind(c(1,1,1,2), c(3, 3,3, 4), c(5, 5,5, 6)))


pdf("pf_figures.pdf", width = 8, height = 15, useDingbats = FALSE)
gridExtra::grid.arrange(x1, m1, x2, m2, x3, m3,
                        layout_matrix = rbind(c(1,1,2), c(3, 3, 4), c(5, 5, 6)))
dev.off()


### another one

oi = 1
xr = extendrange(dx2$lng[oi]+c(-0.001, 0.001))
yr = extendrange(dx2$lat[oi]+c(-0.0008,0.0008))
bbox = c(xr[1], yr[1], xr[2], yr[2])
# akl = get_stamenmap(bbox, zoom = 17, maptype = "toner-hybrid")
akl = get_googlemap(dx2[oi,c('lng', 'lat')] %>% as.numeric, zoom = 19,
    maptype="roadmap")

map <- ggmap(akl) +
    geom_rect(aes(xmin = -Inf, xmax = Inf, ymin = -Inf, ymax = Inf),
            fill = "white", alpha = 0.3) +
    geom_point(aes(Yobs[2], Yobs[1]), pch = 4, colour = "red",
               size = 5, stroke = 2) + 
    geom_point(aes(lng, lat), data = dx2[oi,], pch = 21, size = 3, stroke = 2,
               fill = "white") + 
    geom_point(aes(lng, lat), data = dx2[oi, ], pch = 21, size = 40, stroke = 1,
                fill = "transparent") +
    geom_point(aes(lng, lat), data = dx2[oi, ], pch = 21, size = 80, stroke = 0.5,
                fill = "transparent") +
    geom_point(aes(lng, lat), data = dx2[oi, ], pch = 21, size = 120, stroke = 0.25,
                fill = "transparent") +
    theme(axis.text = element_blank(), 
          axis.ticks = element_blank(),
          panel.grid.major = element_blank()) + xlab("") + ylab("")

pdf("pf_figures-geodist.pdf", width = 6, height = 6, useDingbats = FALSE)
map
dev.off()




devtools::load_all('~/Documents/uni/gtfsnetwork')

gtfs <- dbConnect(SQLite(), gtfs.db)
shapeid <- gtfs %>% tbl("routes") %>% select(shape_id, route_id) %>%
    filter(route_id %like% "27401%v62.9" |
           route_id %like% "24807%v62.9" |
           route_id %like% "25801%v62.9" |
           route_id %like% "30201%v62.9") %>%
    collect %>% pluck('shape_id')

shape <- gtfs %>% tbl("shapes") %>%
    filter(shape_id %in% shapeid) %>%
    arrange(shape_id, seq) %>% collect

dbDisconnect(gtfs)

shp <- shape %>%
    mutate(
        shape_id = gsub("-.+", "", shape_id),
        .lng = lng + case_when(shape_id == "10" ~ 0.00045,
                               shape_id == "958" ~ -0.0005,
                               shape_id == "554" ~ 0.00085,
                               TRUE ~ 0),
        .lat = lat + case_when(shape_id == "958" ~ 0.00005,
                               TRUE ~ 0)
    )
xr = extendrange(shp$lng)
yr = extendrange(shp$lat)
bbox = c(mean(xr), mean(yr), xr[2], yr[2])
akl = get_stamenmap(bbox, zoom = 14, maptype = "toner-hybrid")



#### GTFS NETWORK GRAPH 1
map <- ggmap(akl) +
    geom_rect(aes(xmin = bbox[1], ymin = bbox[2],
                  xmax = bbox[3], ymax = bbox[4]),
              fill = "white", alpha = 1) +
    geom_path(aes(.lng, .lat, group = shape_id, colour = shape_id),
              data = shp, #color = "skyblue2",
              alpha = 0.9, lwd = 2) +
    theme(axis.text = element_blank(), 
          axis.ticks = element_blank(),
          legend.position = "none",
          panel.grid.major = element_blank()) + xlab("") + ylab("")
#map

pdf("gtfs-nw_figure1.pdf", width = 8, height = 12, useDingbats = FALSE)
map
dev.off()


#### GTFS NETWORK GRAPH 2
##
##-> intersections located, segments drawn ...

NULL












#### GTFS NETWORK - PRIOR GRAPH 1

X <- x <- 20
P <- p <- 2
n <- 30
lambda <- 0

KF <- function(x, P, mu, sigma, delta, lambda = 1/600,
               keep = FALSE) {
    if (keep) {
        hist <- list(x = numeric(delta)+1, P = numeric(delta)+1)
    }
    hist$x[1] <- x
    hist$P[1] <- P
    for (i in 1:delta) {
        l <- P / (P + sigma)
        x <- x + l*lambda * (mu - x)
        q <- (1 - (1 - l*lambda)^2) * sigma
        P <- (1 - l*lambda)^2 * P + q
        ##P <- P + lambda * (x / (x + mu))^2 * (sigma - P)
        hist$x[i+1] <- x
        hist$P[i+1] <- P
    }
    o <- list(x = x, P = P)
    if (keep) o$hist <- hist
    o
}

pmean <- 30
pvar <- 30
r <- KF(20, 1, pmean, pvar, 3600, lambda=1/300, keep = TRUE)
r <- r$hist %>%
    as.tibble %>%
    add_column(i = 1:nrow(.)-1L, .before = 1)
ti <- 5*60+1
obsx <- 19
obsv <- 1
p0 <- ggplot(r, aes(i/60)) +
    geom_hline(yintercept = pmean + sqrt(pvar) * c(0, -1, 1),
               lty = 2, lwd = c(1.5, 1, 1), col = "steelblue") +
    geom_line(aes(y = pmax(0, x - sqrt(P)))) +
    geom_line(aes(y = pmax(0, x + sqrt(P)))) +
    geom_line(aes(y = x), lwd = 1.5) +
    xlab("Time since last observation (min)") + ylab("Road speed (km/h)")

p1 <- p0 + geom_pointrange(aes(x = 5, y = obsx, ymin = obsx-obsv, ymax = obsx+obsv),
                    data = NULL, col = "red", fill = "white", pch = 21)

pdf("gtfs-nw_prior1.pdf", width = 8, height = 6, useDingbats = FALSE)
p0
dev.off()

pdf("gtfs-nw_prior2.pdf", width = 8, height = 6, useDingbats = FALSE)
p1
dev.off()


## xx <- seq(10, 50, length = 1001)
## p2 <- ggplot(mapping = aes(x = xx)) +
##     ## previous state
##     geom_line(aes(y = dnorm(xx, r$x[1], sqrt(r$P[1]))), lty = 2) +
##     ## prior state
##     geom_line(aes(y = dnorm(xx, pmean, sqrt(pvar))), col = "steelblue", lty = 2) +
##     ## predicted state
##     geom_line(aes(y = dnorm(xx, r$x[ti], sqrt(r$P[ti])))) +
##     ## observation
##     geom_line(aes(y = dnorm(xx, obsx, obsv)), col = "orangered") +
##     xlab("Road speed (km/h)") + ylab("") +
##     theme(axis.ticks.y = element_blank(),
##           axis.text.y = element_blank())
## #p2

## pdf("gtfs-nw_prior2.pdf", width = 8, height = 5, useDingbats = FALSE)
## p2
## dev.off()


## ## calculate the posterior state
## xhat <- r$x[ti]
## phat <- r$P[ti]
## yt <- obsx - xhat
## S <- phat + obsv^2
## K <- phat / S
## x <- xhat + K * yt
## p <- (1 - K) * phat

## p3 <- ggplot(mapping = aes(x = xx)) +
##     ## predicted state
##     geom_line(aes(y = dnorm(xx, r$x[ti], sqrt(r$P[ti]))), lty = 2) +
##     ## observation
##     geom_line(aes(y = dnorm(xx, obsx, obsv)), col = "orangered", lty = 2) +
##     ## updated state
##     geom_line(aes(y = dnorm(xx, x, sqrt(p)))) +
##     xlab("Road speed (km/h)") + ylab("") +
##     theme(axis.ticks.y = element_blank(),
##           axis.text.y = element_blank())
## #p3

## pdf("gtfs-nw_prior3.pdf", width = 8, height = 5, useDingbats = FALSE)
## p3
## dev.off()


r2 <- KF(x, p, pmean, pvar, 3600-60*5, lambda=1/300, keep = TRUE)
r2 <- r2$hist %>%
    as.tibble %>%
    add_column(i = 1:nrow(.)-1L + 60*5, .before = 1)
p4 <- ggplot(r, aes(i/60)) +
    geom_hline(yintercept = pmean + sqrt(pvar) * c(0, -1, 1),
               lty = 2, lwd = c(1.5, 1, 1), col = "steelblue") +
    geom_line(aes(y = pmax(0, x - sqrt(P))), lty = 2, data = r,
              color = "gray") +
    geom_line(aes(y = pmax(0, x + sqrt(P))), lty = 2, data = r,
              color = "gray") +
    geom_line(aes(y = x), data = r, color = "gray") +
    geom_line(aes(y = x), data = r2) +
    geom_line(aes(y = x - sqrt(P)), data = r2, lty = 2) +
    geom_line(aes(y = x + sqrt(P)), data = r2, lty = 2) +
    xlab("Time since last observation (min)") + ylab("Road speed (km/h)") +
    geom_pointrange(aes(x = 5, y = obsx, ymin = obsx-obsv, ymax = obsx+obsv),
                    col = "red", fill = "white", pch = 21)
# p4

pdf("gtfs-nw_prior3.pdf", width = 8, height = 6, useDingbats = FALSE)
p4
dev.off()




#############################################
#############################################




## Predicting arrival time ...





