﻿using HamroShoppingApp.Models.Product;
using System.ComponentModel.DataAnnotations;

namespace HamroShoppingApp.Models.Category
{
    public class AppCategory
    {
        [Key]
        public int Id { get; set; }
        public string CategoryName { get; set; }
        public byte[] PhotoPath { get; set; }

        public ICollection<AppProduct> Products { get; set; }

    }
}
