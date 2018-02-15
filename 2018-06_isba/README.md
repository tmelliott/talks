# How can we improve bus ETAs? Using real-time position data to estimate road state
## ISBA 2018 - Edinburgh

_Keywords: 
recursive bayes,
particle filter,
Kalman filter,
public transport,
gtfs_


Many bus arrival-time prediction methods do not account for congestion
levels of roads along the route.
For example, real-time feeds based on GTFS, an API specification for transit data
used in Auckland, New Zealand and many other cities worldwide,
use "scheduled arrival time + current delay".
If it were available, this congestion information
would greatly increase the reliability of arrival-time predictions,
and improve commuter satisfaction.
While no direct measurement of congestion is available (at least in general),
we do have GPS trajectories for recent buses along upcoming roads.
We have developed a particle filter that implements an improved vehicle model
to estimate vehicle state using real-time vehicle locations from a GTFS feed.
From this we can estimate the vehicle's travel time along road segments,
which is in turn used to update the state of the road network
using an (extended) Kalman filter.
In the absence of recent buses, the network model
has been formulated to converge towards a time-dependent prior
based on historical data, allowing for peak periods.
The vehicle and road network states can then be combined to generate
a predictive distribution of arrival times.

