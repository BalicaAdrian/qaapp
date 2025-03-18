
# qaapp

An application of q&a. The app should be possible to create questions, answers, to vote them, see some metrics. With different tech specification like microservices, realtime communication, oAuth, tests, docker etc. 

In the following parts we will talk about the arhitecture that i picked the main points of the app and what it contains other nice to have points and todo. Also it will have described a approximate flow for deploying.

## Table of contets
- [Architecture](#architecture)
- [Tests](#tests)
- [NiceToHave/Todo/Ideas/Thoughts](#nicetohavetodoideasthoughts)
- [Working Flow](#working-flow)
- [Developtment flow](#development-flow)
- [Deploy Process](#deploy-process)

## Developtment flow

## Arhitecture

I choosed a microservices app created in nestJs. I'll explain each services from schema what is used for. At the end of the readme you can fine some ideas regarding this and maybe some possible improvments. **Microservices communicate between them with TCP protocol**

![image](https://github.com/user-attachments/assets/17b3306a-3a3e-4c35-ae57-a5ceaf6ee856)
- **gateway** - this service is actually the service which is hit by the client with Http Requests. It provides an REST API in order to make possible for client to communicate with the app. On this also we have the auth flow and the verification if user is logged and has access to our  resources. **MENTIONS** It should have been done with oAuth2.0, i tried to use the google one in order to make but i had some bugs regarding to get the token. On the redirect call came from google I received a code which should have been used in getTOken(code) function to get the idToken but i received an error (grand_invalid) and i didnt manage to find it in time what was the cause of not permiting the grants even if i set the in the config of the google-auth-library. But I created the guard that used functie verifyIdToken(idToken) in order to check if the token set on request is valid and it worked because i succeded to take the token based on the same configuration that i put in postman and it worked, to test the guard functionality. I commented that code and create a basic jwt authentification in the end in order to be able to create users and continue the logic of the application  

- **app-serivce** - this microservice plays a role of a **data process layer**. This is actually the layer that thake information from the other microservices, process them (mapping the informations fro other services, calculating things that that need information from other services). Also this was made also as a scope for **caching data with a redis**. In this case I cached the get_all_question requests which should have been the biggest. At every get is verifying in redis if the question exist and return it from there or if not continue with the entire flow and at the end it gets add in redis. Any other request that change the question (nr fo answers, adding votes etc.) invalidate the caching by deleting it. Also this microservice is used for **realtime-communication**. I used **websockets** in order when everything regarding the question and answer is changed (add, vote etc.) it sned a broadcast message to all the clients connected to the socket. The client actually would be the frontend application and this will listen and when they receive a message on the socket they will update the interface in real time.
- **user-service** - this microservice is the where the logic for user is created. It has an own db, **mariaDb**, **relational one**, that is taking care in creating the user, get user etc. Here i used **typeorm** in order to communicate with the database and also created **migration** for production. In development I used **synchronize** true for faster development, which because false in production.  
- **user-service** - this microservice is the where the logic for votes, questions and aswers is created. It has also a mariaDb. I worked the same way as in user with migration and synchronize. Also this service has relations between tables. 1:M for question with answer, 1:M for question with votes and 1:M for answer with votes. These tables also content a column called the userId which is a **foreign key** from the other db microservices usde in app-service to match the data. **They tables are in different databases**, in different environament lets say

![image](https://github.com/user-attachments/assets/64e6a304-e205-4736-bb3e-b03416357b11)

## Tests
For this, in the limited time I had i tried to write as many types of tests as possible. I used **jest** for tests

-  Created tests by **mocking the db functions** for question service 'question.service.spec.ts' and for "vote.service.spec.ts" same from quesiton-service
- Created tests by **creating a temporary db in sqlite** for answers ("answear.service.spec.ts") from question-service and for user from user-service ("user.service.spec.ts")
- Created **e2e** in gateway for some flows by generating in test file the entire arhitecture of the app and their own temporary dbs in sqlite

Also created some other tests in "question.controller.spec.ts".  I could've write more test but I wanted to have some from all the typem with the time I had
Example of coverage report geretatin bu running the test with --coverage flag

![image](https://github.com/user-attachments/assets/3d36265b-17d4-48e4-9e1b-00559ce58ee0)

## NiceToHave/Todo/Ideas/Thougts
- Creation of a new service jsut for authentification
- To succeded to implement the oauth2.0 by finding that bug
- Write tests for everything
- Using transactions i,n case of added complex logic in db queries 

## Working Flow
I used **docker-compose** and **dockerfile** for development. For a faster development i created a **docker-compose.dev.yml** which was creating only the dbs (redis and mariaDbs) and the application. I run the app locally, in terminal, in order to have a faster way to  develop and debug, considering in docker the build and docker-compose up would have take much longer time. For the production part I create a **docker-compose-prod.yml** which build each microservices based on the dockerfile that they have. Into it i have the npm run:prod command and other option like copying the app, runnning the build and migrations where was needed and exposing ports. Also in docker-compose-prod.yml are defined the volumes, the network that images run in docker, ports and environtment variables. For both situations I also added for a easier way to check the db values, by adding tools for administrate database like **phpmyadmin** and **redis commander**.


## Deploy process

The services we can use from AWS in order to make a deploy:
- ECR - Elastic Container Registry- which will store the build images (similar as docker hub)
- ECS Cluster - Elastic Container Service - the service that run the images in clusters - which can use  Amazon EC2 instances or Serverless (AWS Fargate)
- An Load Balancer service - that will help by coordonate the trafic and to answar to the question from task **it can keep the application availability during rolling updates by doing blue/green deployment**
- RDS - database service with aws
- AWS ElasticCahce - for redis db
- AWS CodePipeline - retrieve the commits/merges from gitHub
- AWS CodeBuild - build teh docker image also push it to ECR
- AWS CodeDeploy - taking care of deploy andcan  create task in order to make possible green/blue deployment

## Developtment flow
    1. Push Code to GitHub which will trigger AWS CodePipeplin
    2. CodeBuild create new docker image and push to ECR
    3. CodeDeploy creates task in ECS Clusters in order to make a green environment and also trigger ALB - application load ballancer to route trafic based on patern(canary/linear)

We might also unse AWS Secret Manager to keep the env variables.
Also this devlopment flow can be created manually or by IaC using teraform or AWS CDK which help to create and intiate the services above
