# ITS Final Frontend

This is the frontend repository of my final exam of my Cloud Development Course at ITS Alto Adriatico.
This repository and the `ITSFinal.Backend` have been produced under 4 hours time. 
I do not have access to the original request of the project since it was on paper, but the general functionality was:
- A web platform to handle data acquisition of sensors with a fixed set of data (for a dynamic one check my pinned Mokametrics project in my home ;)).
  - Due to time data acquisition is simplified as an http endpoint called by a postman/insomnia client or could have been a service worker that generated data. It was treated the same way as far as points.
- Ability for a user to list every sensor data in a table
- Bonus points for a distributed architecture
- Bonus points for making a scalable adn consistent architecture for data acquisition
- Points for code quality and architecture
> For the frontend only:
- Bonus points for the ability to edit the data

This project satisfied every point and is composed of:

- A page for listing sensors first
- A page to list every sensor measure
- I tried at first to do some filtering / stats but I was getting short on time so I just commented out all those parts 
- Editing of both sensor data and sensor measures data
- Creation of new sensors

## Stack
- React 19 with Vite
- Antd as the UI library
- Github actions for the CD pipeline and Azure Static Web App for deployment. (Could have gone for Azure Container apps for both with more time) 

## Utility

for local use: 
it requires node lts/jod version

run `npm i`

run `npm start`
