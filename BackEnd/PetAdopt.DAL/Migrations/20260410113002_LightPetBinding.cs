using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PetAdopt.DAL.Migrations
{
    /// <inheritdoc />
    public partial class LightPetBinding : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PrimaryImageUrl",
                table: "Pets",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PrimaryImageUrl",
                table: "Pets");
        }
    }
}
