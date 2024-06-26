"use client";

import { CartContext } from "@/app/context/cart";
import { calculateProductTotalPrice, formatCurrency } from "@/app/helpers/price";
import Cart from "@/components/cart";
import DeliveryInfo from "@/components/delivery-info";
import DiscountBadge from "@/components/discount-badge";
// import ProductList from "@/app/products/components/product-list";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Prisma } from "@prisma/client";
import { ChevronLeftIcon, ChevronRightIcon, } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useContext, useState } from "react";

interface ProductDetailsProps {
    product: Prisma.ProductGetPayload<{
      include: {
        restaurant: true;
      };
    }>;
    // complementaryProducts: Prisma.ProductGetPayload<{
    //   include: {
    //     restaurant: true;
    //   };
    // }>[];
  }
  
const ProductDetails = ({ 
  product, 
  // complementaryProducts, 
}: ProductDetailsProps) => {
    const [quantity, setQuantity] = useState(1);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);

    const { addProductToCart, products } = useContext(CartContext);
  
    // console.log(products);
    const addToCart = ({ emptyCart }: { emptyCart?: boolean }) => {
      addProductToCart({ product:{...product, quantity}, emptyCart });
      setIsCartOpen(true);
    };
  
    const handleAddToCartClick = () => {
      // addProductToCart(product, quantity);
      // setIsCartOpen(true);
      // VERIFICAR SE HÁ ALGUM PRODUTO DE OUTRO RESTAURANTE NO CARRINHO
      const hasDifferentRestaurantProduct = products.some(
        (cartProduct) => cartProduct.restaurantId !== product.restaurantId,
      );

      // SE HOUVER, ABRIR UM AVISO
      if (hasDifferentRestaurantProduct) {
        return setIsConfirmationDialogOpen(true);
      }

      addToCart({
        emptyCart: false,
      });
    };

    const handleIncreaseQuantityClick = () => {
      setQuantity((prev) => prev + 1);
    }
      
    const handleDecreaseQuantityClick = () => {
      setQuantity((prev) => (prev === 1 ? prev : prev - 1));
    }
  
    return (
      <>
        <div className="relative z-50 mt-[-1.5rem] rounded-tl-3xl rounded-tr-3xl bg-white py-5">
          {/* RESTAURANTE */}
          <div className="flex items-center gap-[0.375rem] px-5">
            <div className="relative h-6 w-6">
              <Image
                src={product.restaurant.imageUrl}
                alt={product.restaurant.name}
                fill
                sizes="100%"
                className="rounded-full object-cover"
              />
            </div>
            <Link href={`/restaurants/${product.restaurant.id}`}>
            <span className="text-xs text-muted-foreground">
              {product.restaurant.name}
            </span>
            </Link>
          </div>
    
          {/* NOME DO PRODUTO */}
          <h1 className="mb-2 mt-1 px-5 text-xl font-semibold">{product.name}</h1>
    
          {/* PREÇO DO PRODUTO E QUANTIDADE */}
          <div className="flex justify-between px-5">
            {/* PREÇO COM DESCONTO */}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">
                  {formatCurrency(calculateProductTotalPrice(product))}
                </h2>
                {product.discountPercentage > 0 && (
                  <DiscountBadge product={product} />
                )}
              </div>
    
              {/* PREÇO ORIGINAL */}
              {product.discountPercentage > 0 && (
                <p className="text-sm text-muted-foreground">
                  De: {formatCurrency(Number(product.price))}
                </p>
              )}
            </div>
    
            {/* QUANTIDADE */}
            <div className="flex items-center gap-3 text-center">
              <Button
                size="icon"
                variant="ghost"
                className="border border-solid border-muted-foreground"
                onClick={handleDecreaseQuantityClick}
              >
                <ChevronLeftIcon />
              </Button>
              <span className="w-4">{quantity}</span>
              <Button size="icon" onClick={handleIncreaseQuantityClick}>
                <ChevronRightIcon />
              </Button>
            </div>
          </div>
    
          {/* DADOS DA ENTREGA */}
          <div className="px-5">
            <DeliveryInfo restaurant={product.restaurant} />
          </div>
    
          <div className="mt-6 space-y-3 px-5">
            <h3 className="font-semibold">Sobre</h3>
            <p className="text-sm text-muted-foreground">{product.description}</p>
          </div>
    
          {/* <div className="mt-6 space-y-3"> */}
            {/* <h3 className="px-5 font-semibold">Sucos</h3> */}
            {/* <ProductList products={complementaryProducts} /> */}
          {/* </div> */}

          <div className="mt-6 px-5">
            <Button className="w-full font-semibold" onClick={handleAddToCartClick} >
              Adicionar à sacola
            </Button>
          </div>
        </div>

        <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
          <SheetContent className="w-[90vw]">
            <SheetHeader>
              <SheetTitle className="text-left">Sacola</SheetTitle>
            </SheetHeader>
            <Cart setIsOpen={setIsCartOpen}/>
          </SheetContent>
        </Sheet>

        <AlertDialog
          open={isConfirmationDialogOpen}
          onOpenChange={setIsConfirmationDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Você só pode adicionar itens de um restaurante por vez
              </AlertDialogTitle>
              <AlertDialogDescription>
                Deseja mesmo adicionar esse produto? Isso limpará sua sacola
                atual.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={() => addToCart({ emptyCart: true })}>
                Esvaziar sacola e adicionar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
};

export default ProductDetails;