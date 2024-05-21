import { useContext, useState } from "react";
import CartItem from "@/components/cart-item";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/app/helpers/price";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { CartContext } from "@/app/context/cart";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { createOrder } from "@/app/actions/order";

const Cart = () => {
    const { products, subtotalPrice, totalPrice, totalDiscounts, clearCart } = useContext(CartContext);
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  
    const { data } = useSession();
  
    const handleFinishOrderClick = async () => {
      if (!data?.user) return;
  
      const restaurant = products[0].restaurant;
  
      try {
        setIsSubmitLoading(true);
  
        await createOrder({
          subtotalPrice,
          totalDiscounts,
          totalPrice,
          deliveryFee: restaurant.deliveryFee,
          deliveryTimeMinutes: restaurant.deliveryTimeMinutes,
          restaurant: {
            connect: { id: restaurant.id },
          },
          status: OrderStatus.CONFIRMED,
          user: {
            connect: { id: data.user.id },
          },
        });
  
        clearCart();
      } catch (error) {
        console.error(error);
      } finally {
        setIsSubmitLoading(false);
      }
    };

    return (
      <>
      <div className="flex h-full flex-col py-5">
        {products.length > 0 ? (
          <>
            <div className="flex-auto space-y-4">
              {products.map((product) => (
                <CartItem key={product.id} cartProduct={product} />
              ))}
            </div>

            {/* TOTAIS */}
            <div className="mt-6">
              <Card>
                <CardContent className="space-y-2 p-5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(subtotalPrice)}</span>
                  </div>
      
                  <Separator />
      
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Descontos</span>
                    <span>- {formatCurrency(totalDiscounts)}</span>
                  </div>
      
                  <Separator className="h-[0.5px]" />
      
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Entrega</span>
      
                    {Number(products?.[0].restaurant.deliveryFee) === 0 ? (
                      <span className="uppercase text-primary">Grátis</span>
                    ) : (
                      formatCurrency(Number(products?.[0].restaurant.deliveryFee))
                    )}
                  </div>
      
                  <Separator />
      
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span>Total</span>
                    <span>{formatCurrency(totalPrice)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* FINALIZAR PEDIDO */}
            <Button className="mt-6 w-full">Finalizar pedido</Button>

          </>
          ) : (
            <h2 className="text-left font-medium">Sua sacola está vazia.</h2>
          )
        }
      </div>

        <AlertDialog
          open={isConfirmDialogOpen}
          onOpenChange={setIsConfirmDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Deseja finalizar seu pedido?</AlertDialogTitle>
              <AlertDialogDescription>
                Ao finalizar seu pedido, você concorda com os termos e condições
                da nossa plataforma.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isConfirmDialogOpen}>
                {isSubmitLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleFinishOrderClick}>
                Finalizar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
};

export default Cart;