library(jsonlite)

eta <- c(10, 8, 6, 0)
t <- c(32, 37, 40, 48)

tt <- min(t):max(t)
etax <- sapply(tt, function(x) {
    i <- which(t <= x)
    i <- i[length(i)]
    eta[i] - (x - t[i])
})

plot(tt, pmax(0, etax), type = "s")

