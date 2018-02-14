# Some cool title
## ISBA 2018 - Edinburgh

_Keywords_: 
`recursive bayes`
`particle filter`
`kalman filter`
`public transport`
`gtfs`

The one critical piece of information that is not incorporated into many 
bus arrival-time prediction methods is real-time congestion.
We have been developing a framework that uses publicly available
vehicle location data to estimate the state---including 
travel times along individual roads---of each bus in the 
public transport network, 
in order to determine the real-time state (i.e., congestion)
of roads within the network.
This new source of information can then be used to make
improved arrival-time predictions,
or (as is most likely) to quantify as much of the uncertainty as possible,
and communicating this to commuters (e.g., using prediction intervals).

The vehicle model has been implemented using a particle filter,
a robust and flexible method for recursive state estimate.
However, the network state has only a single parameter---travel time---and 
so we have been able to implement an extended Kalman filter (EKF) that,
without any input, converges to the prior (based on historical data).
