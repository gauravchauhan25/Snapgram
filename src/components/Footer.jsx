import React from "react";
import { footerCategories } from "../sources/categories";

export default function Footer() {
  const [selectedCategory, setSelectedCategory] = useState("Home");

  return (
    <>
      <footer>
        {footerCategories.map((category) => (
          <a
            className="menu-item"
            onClick={() => setSelectedCategory(category.name)}
            style={{
              background:
                category.name === selectedCategory && "hsl(252, 67%, 51%)",
              color: "white",
            }}
            key={category.name}
          >
            <h3>
              {category.icon} {category.name}
            </h3>
          </a>
        ))}
      </footer>
    </>
  );
}
