# Distributed Architecture for Process Mining Platform
This is the repository that holds the implementation of the solution proposed in the master's thesis *A Distributed Architecture for Process Mining: Deploying and Executing Process Mining Pipelines* by Sergi Doce and Hamed Tounsi at Danmarks Tekniske Universitet.

This is the implementation for a DAPM Peer, which, in conjunction with other DAPM Peers, form the DAPM Platform. This platform allows users to share resources and build and execute process mining pipelines with them. 

## Microservices
The project is developed using C# and .NET and is based on microservices. Each microservice has its own project. The following are the microservices implementing the features of DAPM:

- DAPM.ResourceRegistryMS.Api (Resource Registry Microservice)
- DAPM.PipelineOrchestratorMS.Api (Pipeline Orchestrator Microservice)
- DAPM.RepositoryMS.Api (Repository Microservice)
- DAPM.OperatorMS.Api (Operator Microservice)

Besides these microservices, the DAPM.Orchestrator project holds the implementation for the DAPM Orchestrator, which is a service that orchestrates the execution of the different microservices. Finally, the DAPM.ClientApi and DAPM.PeerApi projects implement the Client API and Peer API respectively.

The RabbitMQLibrary folder holds all the code related to asynchronous communication using message queues. It contains the consumers and producers base clases, as well as the message models.

## Projects Structure and Software Principles
In this project we have made great emphasis on the decoupling of the software, the single responsability principle, and the dependency inversion principle. Because of this, the implementation in each microservice is often divided in different layers:

- External interface layer, handling communication with the exterior. In this case this is implemented by RabbitMQ Consumers in the Consumers folder.
- Services layer, implementing business logic and using the data models specific to that microservice, leaving behind the models used in the API.
- Repositories layer, implementing communication with any data persistance service such as databases.

All these layers are abstracted using interfaces, so their implementations can be changed easily.

Due to time and resource limitations during the project, these principles are not always applied. Despite this, this principles have allowed us to implement an easily extensible software for future developers.

## Deployment
- First setup /etc/hosts/ by adding 127.0.0.1	rabbitmq to the end (first time only).

- Use 3 terminal windows

- Go to Backend/DAPM and run:

```
docker-compose up
```

If you do not want to block the command line, you can add the option `-d`.

In a different terminal window go to Backend/DAPM/DAPM.AppHost and run

```
dotnet run
```

In the terminal there will be a link to the .NET microservices dashboard.
