library(RProtoBuf)
library(RSQLite)

readProtoFiles(dir = "~/Documents/uni/TransitNetworkModel/proto")

dat <- read(transit_realtime.FeedMessage,
            "~/Dropbox/gtfs/vehicle_locations.pb")$entity
dat.df <- do.call(rbind, lapply(dat, function(x) {
    data.frame(id = x$vehicle$vehicle$id,
               lat = x$vehicle$position$latitude,
               lng = x$vehicle$position$longitude,
               route = x$vehicle$trip$route_id)
}))
write.csv(dat.df, "../data/vehicles.csv", quote = FALSE, row.names = FALSE)


con <- dbConnect(SQLite(), "~/Documents/uni/TransitNetworkModel/gtfs.db")
res <- dbGetQuery(con, "SELECT lat, lng FROM shapes WHERE shape_id=(SELECT shape_id FROM routes WHERE route_short_name='110' LIMIT 1) ORDER BY seq")
write.csv(res, "../data/route110.csv", quote = FALSE, row.names = FALSE)


tt <- function(x) as.POSIXct(x, origin="1970-01-01")
nws <- read(transit_network.Feed, "~/Dropbox/gtfs/nws.pb")$segments

segs <- do.call(rbind, lapply(nws, function(x) {
        len <- ifelse(x$length == 0, 
                      geosphere::distHaversine(c(x$start$lng, x$start$lat), c(x$end$lng, x$end$lat)),
                      x$length)
        travel.time = ifelse(x$travel_time == 0, NA, x$travel_time)
        data.frame(id = as.character(x$segment_id),
                   # length = len,
                   speed = len / travel.time / 1000 * 60 * 60,
                   xstart = x$start$lng, xend = x$end$lng,
                   ystart = x$start$lat, yend = x$end$lat)
    }))

write.csv(segs, "../data/segments.csv", quote = FALSE, row.names = FALSE)