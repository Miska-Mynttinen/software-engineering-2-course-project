#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER app
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["DAPM.Orchestrator/DAPM.Orchestrator.csproj", "DAPM.Orchestrator/"]
RUN dotnet restore "./DAPM.Orchestrator/DAPM.Orchestrator.csproj"
COPY . .
WORKDIR "/src/DAPM.Orchestrator"
RUN dotnet build "./DAPM.Orchestrator.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./DAPM.Orchestrator.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Change file permissions
USER root
RUN chmod -R 777 /app
USER app

ENTRYPOINT ["dotnet", "DAPM.Orchestrator.dll"]