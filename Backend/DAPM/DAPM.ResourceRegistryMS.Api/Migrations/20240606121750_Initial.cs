﻿using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DAPM.ResourceRegistryMS.Api.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Peers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Domain = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Peers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ResourceTypes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    FileExtension = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ResourceTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Repositories",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    PeerId = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Repositories", x => new { x.PeerId, x.Id });
                    table.ForeignKey(
                        name: "FK_Repositories_Peers_PeerId",
                        column: x => x.PeerId,
                        principalTable: "Peers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Resources",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    PeerId = table.Column<Guid>(type: "uuid", nullable: false),
                    RepositoryId = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    ResourceTypeId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Resources", x => new { x.PeerId, x.RepositoryId, x.Id });
                    table.ForeignKey(
                        name: "FK_Resources_Peers_PeerId",
                        column: x => x.PeerId,
                        principalTable: "Peers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Resources_Repositories_PeerId_RepositoryId",
                        columns: x => new { x.PeerId, x.RepositoryId },
                        principalTable: "Repositories",
                        principalColumns: new[] { "PeerId", "Id" },
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Resources_ResourceTypes_ResourceTypeId",
                        column: x => x.ResourceTypeId,
                        principalTable: "ResourceTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });
            
            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    PeerId = table.Column<Guid>(type: "uuid", nullable: true),
                    Username = table.Column<string>(type: "text", nullable: false),
                    Password = table.Column<string>(type: "text", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: false),
                    UserType = table.Column<string>(type: "text", nullable: false),
                    UserStatus = table.Column<string>(type: "text", nullable: false),
                    UserGroups = table.Column<string>(type: "jsonb", nullable: false), // Store List<string> as JSONB
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.UserId); // Only UserId is a primary key, removed PeerId
                    /* table.ForeignKey(
                        name: "FK_Users_Peers_PeerId",
                        column: x => x.PeerId,
                        principalTable: "Peers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);*/
                });
            
            migrationBuilder.CreateTable(
                name: "UserGroups",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    PeerId = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserGroups", x => new { x.PeerId, x.Id });
                    table.ForeignKey(
                        name: "FK_UserGroups_Peers_PeerId",
                        column: x => x.PeerId,
                        principalTable: "Peers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Resources_ResourceTypeId",
                table: "Resources",
                column: "ResourceTypeId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Resources");

            migrationBuilder.DropTable(
                name: "Repositories");

            migrationBuilder.DropTable(
                name: "ResourceTypes");

            migrationBuilder.DropTable(
                name: "Peers");

            migrationBuilder.DropTable(
                name: "Users");
            
            migrationBuilder.DropTable(
                name: "UserGroups");
        }
    }
}
