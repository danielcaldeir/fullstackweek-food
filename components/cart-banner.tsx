"use client";

import { CartContext } from "@/app/context/cart";
import { formatCurrency } from "@/app/helpers/price";
import Cart from "@/components/cart";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Restaurant } from "@prisma/client";
import { useContext, useState } from "react";

interface CartBannerProps {
  restaurant: Pick<Restaurant, "id">;
}

const CartBanner = ({ restaurant }: CartBannerProps) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { products, totalPrice, totalQuantity } = useContext(CartContext);

  const restaurantHasProductsOnCart = products.some(
    (product) => product.restaurantId === restaurant.id,
  );

  const handleViewBag = () => {
    setIsCartOpen(!isCartOpen);
    // console.log(isCartOpen);
  }

  if (!restaurantHasProductsOnCart) return null;

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full border-t border-solid border-muted bg-transparent p-5 pt-3 shadow-md">
      <div className="flex items-center justify-end">
        {/* PREÇO */}
        <div>
          <span className="text-xs text-muted-foreground">
            Total sem entrega
          </span>
          <h3 className="font-semibold">
            {formatCurrency(totalPrice)}
            {" "}
            <span className="text-xs font-normal text-muted-foreground">
              {" "}
              / 
              {totalQuantity} 
              {totalQuantity > 1 ? "itens" : "item"}
            </span>
          </h3>
        </div>
        {/* BOTÃO */}
        {/* <Button onClick={() => setIsCartOpen(true)}>Ver sacola</Button> */}

        <Sheet>
          <SheetTrigger>
            <Button onClick={handleViewBag}>Ver sacola</Button>
          </SheetTrigger>
          <SheetContent className="w-[90vw]">
            <SheetHeader>
              <SheetTitle className="text-left">Sacola</SheetTitle>
            </SheetHeader>
            <Cart setIsOpen={setIsCartOpen}/>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default CartBanner;