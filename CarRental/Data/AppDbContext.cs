using Microsoft.EntityFrameworkCore;
using CarRental.Models;
using CarRental.Models.Entites;
using CarRental.Services.Password;

namespace CarRental.Views.CarList.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<UserAccount> UserAccounts { get; set; }
        public DbSet<Renters> Renters { get; set; }
        public DbSet<RentalRequest> RentalRequests { get; set; }
        public DbSet<Car> Cars { get; set; }
        public DbSet<Rentals> Rentals { get; set; }

        public DbSet<CustomerInquiry> CustomerInquiries { get; set; }

 

        public DbSet<Notification> Notifications { get; set; }



        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<UserAccount>().HasData(
              new UserAccount
              {
                  UserId = 1,
                  FirstName = "Dm",
                  LastName = "Cars",
                  Username = "dmcars",
                  Email = "dmcarss23@email.com",
                  Password = PasswordHelper.HashPassword("dmcars23"),
                  Role = "Admin"
              }
          );

                  modelBuilder.Entity<Car>().HasData(
                    new Car { CarId = 1, Brand = "Toyota", Model = "Vios", Seaters = 5, LuggageCapacity = 3, FuelType = "Gasoline", FuelTankCapacity = 42, FuelEfficiency = "15 km/L (city), 20 km/L (highway)", Transmission = "CVT (Automatic)", GroundClearance = 150, Airbags = "Driver, Passenger", BrakingSystem = "ABS, EBD, Brake Assist", TireSize = "185/60 R15, All-Season", ImageUrl = "vios.png", RentalPrice = 2000m, Status = "Available" },
                    new Car { CarId = 2, Brand = "Honda", Model = "City", Seaters = 5, LuggageCapacity = 3, FuelType = "Gasoline", FuelTankCapacity = 40, FuelEfficiency = "17 km/L (combined)", Transmission = "CVT", GroundClearance = 134, Airbags = "Driver, Passenger", BrakingSystem = "ABS, EBD", TireSize = "185/55 R16, All-Season", ImageUrl = "city.png", RentalPrice = 2200m, Status = "Available" },
                    new Car { CarId = 3, Brand = "Mitsubishi", Model = "Mirage G4", Seaters = 5, LuggageCapacity = 3, FuelType = "Gasoline", FuelTankCapacity = 42, FuelEfficiency = "18 km/L (combined)", Transmission = "CVT", GroundClearance = 160, Airbags = "Driver, Passenger", BrakingSystem = "ABS, EBD", TireSize = "175/55 R15, All-Season", ImageUrl = "mirage.png", RentalPrice = 2000m, Status = "Available" },
                    new Car { CarId = 4, Brand = "Nissan", Model = "Almera", Seaters = 5, LuggageCapacity = 3, FuelType = "Gasoline", FuelTankCapacity = 41, FuelEfficiency = "14 km/L (city), 19 km/L (highway)", Transmission = "Automatic", GroundClearance = 135, Airbags = "Driver, Passenger", BrakingSystem = "ABS, EBD, Brake Assist", TireSize = "185/65 R15, All-Season", ImageUrl = "almera.png", RentalPrice = 2300m, Status = "Available" },
                    new Car { CarId = 5, Brand = "Ford", Model = "EcoSport", Seaters = 5, LuggageCapacity = 4, FuelType = "Gasoline", FuelTankCapacity = 52, FuelEfficiency = "12 km/L (city), 16 km/L (highway)", Transmission = "Automatic", GroundClearance = 209, Airbags = "Driver, Passenger", BrakingSystem = "ABS, EBD", TireSize = "205/50 R17, All-Season", ImageUrl = "ecosport.png", RentalPrice = 2800m, Status = "Available" },
                    new Car { CarId = 6, Brand = "Suzuki", Model = "Dzire", Seaters = 5, LuggageCapacity = 3, FuelType = "Gasoline", FuelTankCapacity = 37, FuelEfficiency = "17 km/L (combined)", Transmission = "Auto Gear Shift (AGS)", GroundClearance = 145, Airbags = "Driver, Passenger", BrakingSystem = "ABS, EBD", TireSize = "185/65 R15, All-Season", ImageUrl = "dzire.png", RentalPrice = 2000m, Status = "Available" },
                    new Car { CarId = 7, Brand = "Toyota", Model = "Hiace", Seaters = 15, LuggageCapacity = 10, FuelType = "Diesel", FuelTankCapacity = 70, FuelEfficiency = "10 km/L (combined)", Transmission = "Manual", GroundClearance = 185, Airbags = "Driver, Passenger", BrakingSystem = "ABS, EBD", TireSize = "215/75 R16, All-Season", ImageUrl = "hiace.png", RentalPrice = 4500m, Status = "Available" },
                    new Car { CarId = 8, Brand = "Ford", Model = "Transit", Seaters = 15, LuggageCapacity = 12, FuelType = "Diesel", FuelTankCapacity = 80, FuelEfficiency = "8 km/L (city), 12 km/L (highway)", Transmission = "6-Speed Manual", GroundClearance = 174, Airbags = "Driver, Passenger", BrakingSystem = "ABS, EBD", TireSize = "235/65 R16, All-Season", ImageUrl = "transit.png", RentalPrice = 4800m, Status = "Available" },
                    new Car { CarId = 9, Brand = "Mercedes-Benz", Model = "Sprinter", Seaters = 12, LuggageCapacity = 12, FuelType = "Diesel", FuelTankCapacity = 75, FuelEfficiency = "8 km/L (combined)", Transmission = "Automatic", GroundClearance = 180, Airbags = "Driver, Passenger, Side", BrakingSystem = "ABS, EBD, Brake Assist", TireSize = "225/75 R16, All-Season", ImageUrl = "sprinter.png", RentalPrice = 5000m, Status = "Available" },
                    new Car { CarId = 11, Brand = "Subaru", Model = "XV", Seaters = 5, LuggageCapacity = 4, FuelType = "Gasoline", FuelTankCapacity = 63, FuelEfficiency = "10 km/L (city), 14 km/L (highway)", Transmission = "CVT (AWD)", GroundClearance = 220, Airbags = "Driver, Passenger, Side", BrakingSystem = "ABS, EBD, Brake Assist", TireSize = "225/55 R18, All-Terrain", ImageUrl = "xv.png", RentalPrice = 3200m, Status = "Available" },
                    new Car { CarId = 12, Brand = "Toyota", Model = "Avanza", Seaters = 7, LuggageCapacity = 4, FuelType = "Gasoline", FuelTankCapacity = 43, FuelEfficiency = "14 km/L (combined)", Transmission = "CVT", GroundClearance = 190, Airbags = "Driver, Passenger, Side", BrakingSystem = "ABS, EBD", TireSize = "185/65 R15, All-Season", ImageUrl = "avanza.png", RentalPrice = 3500m, Status = "Available" },
                    new Car { CarId = 13, Brand = "Mitsubishi", Model = "Xpander", Seaters = 7, LuggageCapacity = 4, FuelType = "Gasoline", FuelTankCapacity = 45, FuelEfficiency = "12 km/L (combined)", Transmission = "Automatic", GroundClearance = 205, Airbags = "Driver, Passenger", BrakingSystem = "ABS, EBD", TireSize = "205/55 R16, All-Season", ImageUrl = "xpander.png", RentalPrice = 3800m, Status = "Available" },
                    new Car { CarId = 14, Brand = "Suzuki", Model = "Ertiga", Seaters = 7, LuggageCapacity = 4, FuelType = "Gasoline", FuelTankCapacity = 45, FuelEfficiency = "13 km/L (city), 17 km/L (highway)", Transmission = "4-Speed Automatic", GroundClearance = 180, Airbags = "Driver, Passenger", BrakingSystem = "ABS, EBD", TireSize = "185/65 R15, All-Season", ImageUrl = "ertiga.png", RentalPrice = 3200m, Status = "Available" },
                    new Car { CarId = 15, Brand = "Nissan", Model = "Livina", Seaters = 7, LuggageCapacity = 4, FuelType = "Gasoline", FuelTankCapacity = 45, FuelEfficiency = "13 km/L (combined)", Transmission = "CVT", GroundClearance = 200, Airbags = "Driver, Passenger", BrakingSystem = "ABS, EBD", TireSize = "205/55 R16, All-Season", ImageUrl = "livina.png", RentalPrice = 3500m, Status = "Available" },
                    new Car { CarId = 16, Brand = "Toyota", Model = "Hiace", Seaters = 15, LuggageCapacity = 10, FuelType = "Diesel", FuelTankCapacity = 70, FuelEfficiency = "10 km/L (combined)", Transmission = "Manual", GroundClearance = 185, Airbags = "Driver, Passenger", BrakingSystem = "ABS, EBD", TireSize = "215/75 R16, All-Season", ImageUrl = "hiace.png", RentalPrice = 4500m, Status = "Available" },
                    new Car { CarId = 17, Brand = "Nissan", Model = "Urvan", Seaters = 15, LuggageCapacity = 10, FuelType = "Diesel", FuelTankCapacity = 65, FuelEfficiency = "9 km/L (combined)", Transmission = "Manual", GroundClearance = 190, Airbags = "Driver, Passenger", BrakingSystem = "ABS, EBD", TireSize = "195/80 R15, All-Season", ImageUrl = "urvan.png", RentalPrice = 4400m, Status = "Available" },
                    new Car { CarId = 18, Brand = "Hyundai", Model = "Starex", Seaters = 12, LuggageCapacity = 10, FuelType = "Diesel", FuelTankCapacity = 75, FuelEfficiency = "9 km/L (city), 13 km/L (highway)", Transmission = "5-Speed Automatic", GroundClearance = 190, Airbags = "Driver, Passenger", BrakingSystem = "ABS, EBD", TireSize = "215/70 R16, All-Season", ImageUrl = "starex.png", RentalPrice = 4600m, Status = "Available" },
                    new Car { CarId = 19, Brand = "Ford", Model = "Transit", Seaters = 15, LuggageCapacity = 12, FuelType = "Diesel", FuelTankCapacity = 80, FuelEfficiency = "8 km/L (city), 12 km/L (highway)", Transmission = "6-Speed Manual", GroundClearance = 174, Airbags = "Driver, Passenger", BrakingSystem = "ABS, EBD", TireSize = "235/65 R16, All-Season", ImageUrl = "transit.png", RentalPrice = 4800m, Status = "Available" },
                    new Car { CarId = 20, Brand = "Mercedes-Benz", Model = "Sprinter", Seaters = 12, LuggageCapacity = 12, FuelType = "Diesel", FuelTankCapacity = 75, FuelEfficiency = "8 km/L (combined)", Transmission = "Automatic", GroundClearance = 180, Airbags = "Driver, Passenger, Side", BrakingSystem = "ABS, EBD, Brake Assist", TireSize = "225/75 R16, All-Season", ImageUrl = "sprinter.png", RentalPrice = 5000m, Status = "Available" }

            );
        }

    }
}
