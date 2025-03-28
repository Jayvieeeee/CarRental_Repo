using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace CarRental.Migrations
{
    /// <inheritdoc />
    public partial class addedCarlist : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Cars",
                columns: table => new
                {
                    CarId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Brand = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Model = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Seaters = table.Column<int>(type: "int", nullable: false),
                    LuggageCapacity = table.Column<int>(type: "int", nullable: false),
                    FuelType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FuelTankCapacity = table.Column<int>(type: "int", nullable: false),
                    FuelEfficiency = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Transmission = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    GroundClearance = table.Column<int>(type: "int", nullable: false),
                    Airbags = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BrakingSystem = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TireSize = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RentalPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cars", x => x.CarId);
                });

            migrationBuilder.CreateTable(
                name: "CustomerInquiries",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Message = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CustomerInquiries", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Notifications",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Message = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Type = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Notifications", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "UserAccounts",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FirstName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Username = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Password = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Role = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    VerificationCode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CodeExpiry = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserAccounts", x => x.UserId);
                });

            migrationBuilder.CreateTable(
                name: "RentalRequests",
                columns: table => new
                {
                    RequestId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    CarId = table.Column<int>(type: "int", nullable: false),
                    RentalDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ReturnDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EstimatedPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ContactNo = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LicenseNo = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RentalRequests", x => x.RequestId);
                    table.ForeignKey(
                        name: "FK_RentalRequests_Cars_CarId",
                        column: x => x.CarId,
                        principalTable: "Cars",
                        principalColumn: "CarId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RentalRequests_UserAccounts_UserId",
                        column: x => x.UserId,
                        principalTable: "UserAccounts",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Renters",
                columns: table => new
                {
                    RenterId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserAccountId = table.Column<int>(type: "int", nullable: false),
                    ContactNo = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LicenseNo = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Renters", x => x.RenterId);
                    table.ForeignKey(
                        name: "FK_Renters_UserAccounts_UserAccountId",
                        column: x => x.UserAccountId,
                        principalTable: "UserAccounts",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Rentals",
                columns: table => new
                {
                    RentalId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RenterId = table.Column<int>(type: "int", nullable: false),
                    CarId = table.Column<int>(type: "int", nullable: false),
                    RentalDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ReturnDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    TotalPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Rentals", x => x.RentalId);
                    table.ForeignKey(
                        name: "FK_Rentals_Cars_CarId",
                        column: x => x.CarId,
                        principalTable: "Cars",
                        principalColumn: "CarId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Rentals_Renters_RenterId",
                        column: x => x.RenterId,
                        principalTable: "Renters",
                        principalColumn: "RenterId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Cars",
                columns: new[] { "CarId", "Airbags", "BrakingSystem", "Brand", "FuelEfficiency", "FuelTankCapacity", "FuelType", "GroundClearance", "ImageUrl", "LuggageCapacity", "Model", "RentalPrice", "Seaters", "Status", "TireSize", "Transmission" },
                values: new object[,]
                {
                    { 1, "Driver, Passenger", "ABS, EBD, Brake Assist", "Toyota", "15 km/L (city), 20 km/L (highway)", 42, "Gasoline", 150, "vios.png", 3, "Vios", 2000m, 5, "Available", "185/60 R15, All-Season", "CVT (Automatic)" },
                    { 2, "Driver, Passenger", "ABS, EBD", "Honda", "17 km/L (combined)", 40, "Gasoline", 134, "city.png", 3, "City", 2200m, 5, "Available", "185/55 R16, All-Season", "CVT" },
                    { 3, "Driver, Passenger", "ABS, EBD", "Mitsubishi", "18 km/L (combined)", 42, "Gasoline", 160, "mirage.png", 3, "Mirage G4", 2000m, 5, "Available", "175/55 R15, All-Season", "CVT" },
                    { 4, "Driver, Passenger", "ABS, EBD, Brake Assist", "Nissan", "14 km/L (city), 19 km/L (highway)", 41, "Gasoline", 135, "almera.png", 3, "Almera", 2300m, 5, "Available", "185/65 R15, All-Season", "Automatic" },
                    { 5, "Driver, Passenger", "ABS, EBD", "Ford", "12 km/L (city), 16 km/L (highway)", 52, "Gasoline", 209, "ecosport.png", 4, "EcoSport", 2800m, 5, "Available", "205/50 R17, All-Season", "Automatic" },
                    { 6, "Driver, Passenger", "ABS, EBD", "Suzuki", "17 km/L (combined)", 37, "Gasoline", 145, "dzire.png", 3, "Dzire", 2000m, 5, "Available", "185/65 R15, All-Season", "Auto Gear Shift (AGS)" },
                    { 7, "Driver, Passenger", "ABS, EBD", "Toyota", "10 km/L (combined)", 70, "Diesel", 185, "hiace.png", 10, "Hiace", 4500m, 15, "Available", "215/75 R16, All-Season", "Manual" },
                    { 8, "Driver, Passenger", "ABS, EBD", "Ford", "8 km/L (city), 12 km/L (highway)", 80, "Diesel", 174, "transit.png", 12, "Transit", 4800m, 15, "Available", "235/65 R16, All-Season", "6-Speed Manual" },
                    { 9, "Driver, Passenger, Side", "ABS, EBD, Brake Assist", "Mercedes-Benz", "8 km/L (combined)", 75, "Diesel", 180, "sprinter.png", 12, "Sprinter", 5000m, 12, "Available", "225/75 R16, All-Season", "Automatic" },
                    { 11, "Driver, Passenger, Side", "ABS, EBD, Brake Assist", "Subaru", "10 km/L (city), 14 km/L (highway)", 63, "Gasoline", 220, "xv.png", 4, "XV", 3200m, 5, "Available", "225/55 R18, All-Terrain", "CVT (AWD)" },
                    { 12, "Driver, Passenger, Side", "ABS, EBD", "Toyota", "14 km/L (combined)", 43, "Gasoline", 190, "avanza.png", 4, "Avanza", 3500m, 7, "Available", "185/65 R15, All-Season", "CVT" },
                    { 13, "Driver, Passenger", "ABS, EBD", "Mitsubishi", "12 km/L (combined)", 45, "Gasoline", 205, "xpander.png", 4, "Xpander", 3800m, 7, "Available", "205/55 R16, All-Season", "Automatic" },
                    { 14, "Driver, Passenger", "ABS, EBD", "Suzuki", "13 km/L (city), 17 km/L (highway)", 45, "Gasoline", 180, "ertiga.png", 4, "Ertiga", 3200m, 7, "Available", "185/65 R15, All-Season", "4-Speed Automatic" },
                    { 15, "Driver, Passenger", "ABS, EBD", "Nissan", "13 km/L (combined)", 45, "Gasoline", 200, "livina.png", 4, "Livina", 3500m, 7, "Available", "205/55 R16, All-Season", "CVT" },
                    { 16, "Driver, Passenger", "ABS, EBD", "Toyota", "10 km/L (combined)", 70, "Diesel", 185, "hiace.png", 10, "Hiace", 4500m, 15, "Available", "215/75 R16, All-Season", "Manual" },
                    { 17, "Driver, Passenger", "ABS, EBD", "Nissan", "9 km/L (combined)", 65, "Diesel", 190, "urvan.png", 10, "Urvan", 4400m, 15, "Available", "195/80 R15, All-Season", "Manual" },
                    { 18, "Driver, Passenger", "ABS, EBD", "Hyundai", "9 km/L (city), 13 km/L (highway)", 75, "Diesel", 190, "starex.png", 10, "Starex", 4600m, 12, "Available", "215/70 R16, All-Season", "5-Speed Automatic" },
                    { 19, "Driver, Passenger", "ABS, EBD", "Ford", "8 km/L (city), 12 km/L (highway)", 80, "Diesel", 174, "transit.png", 12, "Transit", 4800m, 15, "Available", "235/65 R16, All-Season", "6-Speed Manual" },
                    { 20, "Driver, Passenger, Side", "ABS, EBD, Brake Assist", "Mercedes-Benz", "8 km/L (combined)", 75, "Diesel", 180, "sprinter.png", 12, "Sprinter", 5000m, 12, "Available", "225/75 R16, All-Season", "Automatic" }
                });

            migrationBuilder.InsertData(
                table: "UserAccounts",
                columns: new[] { "UserId", "CodeExpiry", "Email", "FirstName", "LastName", "Password", "Role", "Username", "VerificationCode" },
                values: new object[] { 1, null, "dmcarss23@email.com", "Dm", "Cars", "f340878ce392d887ad22e736f48a0ee0af77a34b0b7d76070e3633376c13406d", "Admin", "dmcars", null });

            migrationBuilder.CreateIndex(
                name: "IX_RentalRequests_CarId",
                table: "RentalRequests",
                column: "CarId");

            migrationBuilder.CreateIndex(
                name: "IX_RentalRequests_UserId",
                table: "RentalRequests",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Rentals_CarId",
                table: "Rentals",
                column: "CarId");

            migrationBuilder.CreateIndex(
                name: "IX_Rentals_RenterId",
                table: "Rentals",
                column: "RenterId");

            migrationBuilder.CreateIndex(
                name: "IX_Renters_UserAccountId",
                table: "Renters",
                column: "UserAccountId");

            migrationBuilder.CreateIndex(
                name: "IX_UserAccounts_Email",
                table: "UserAccounts",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserAccounts_Username",
                table: "UserAccounts",
                column: "Username",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CustomerInquiries");

            migrationBuilder.DropTable(
                name: "Notifications");

            migrationBuilder.DropTable(
                name: "RentalRequests");

            migrationBuilder.DropTable(
                name: "Rentals");

            migrationBuilder.DropTable(
                name: "Cars");

            migrationBuilder.DropTable(
                name: "Renters");

            migrationBuilder.DropTable(
                name: "UserAccounts");
        }
    }
}
