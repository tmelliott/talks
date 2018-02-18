# Historical data-based priors for better bus arrival-time prediction
## useR!2018, Brisbane

We have been developing a real-time bus arrival-time prediction framework,
which so far relies solely on real-time data.
However, we believe we can improve predictions (especially long-range, 20+ minutes)
by incorporating historical data into the priors.
This is especially useful in locations with infrequent buses,
or before and after peak hour when travel times increase and decrease, respectively.
Using a years' worth of GPS location data from buses in Auckland, New Zealand,
we explore various models to develop time-dependent priors for bus travel time.


