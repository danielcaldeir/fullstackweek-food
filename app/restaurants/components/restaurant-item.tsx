"use client";

import { Restaurant, UserFavoriteRestaurant } from "@prisma/client";
import { BikeIcon, HeartIcon, HeartOffIcon, StarIcon, TimerIcon } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/app/helpers/price";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { toggleFavoriteRestaurant } from "@/app/actions/restaurant";
import { useSession } from "next-auth/react";
import { isRestaurantFavorited } from "@/app/helpers/restaurant";

interface RestaurantItemProps {
  // userId?: string;
  restaurant: Restaurant;
  className?: string;
  userFavoriteRestaurants: UserFavoriteRestaurant[];
}

const RestaurantItem = ({ 
  // userId, 
  restaurant, 
  className, 
  userFavoriteRestaurants, 
}: RestaurantItemProps) => {
  // console.log(userFavoriteRestaurants);
  const { data } = useSession();
  const isFavorite = isRestaurantFavorited(
    restaurant.id,
    userFavoriteRestaurants,
  );

  const handleFavoriteClick = async () => {
    // if (!userId) return;
    if (!data?.user.id) return;
    try {
      await toggleFavoriteRestaurant(data?.user.id, restaurant.id);
      toast.success(
        isFavorite
          ? "Restaurante removido dos favoritos."
          : "Restaurante favoritado.",
      );
    } catch (error) {
      toast.error("Erro ao favoritar restaurante.");
    }
  };
    return (
      <div className={cn("min-w-[266px] max-w-[266px]", className)}>
        <div className="w-full space-y-3">
          {/* IMAGEM */}
          <div className="relative h-[136px] w-full">
            <Link href={`/restaurants/${restaurant.id}`} >
              <Image
                src={restaurant.imageUrl}
                fill
                sizes="100%"
                className="rounded-lg object-cover"
                alt={restaurant.name}
              />
            </Link>
            
    
            <div className="absolute left-2 top-2 flex items-center gap-[2px] rounded-full bg-primary bg-white px-2 py-[2px]">
              <StarIcon size={12} className="fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-semibold">5.0</span>
            </div>
    
            {data?.user.id && (
              <Button
                size="icon"
                className={`absolute right-2 top-2 h-7 w-7 rounded-full bg-gray-700 ${isFavorite && "bg-primary hover:bg-gray-700"}`}
                onClick={handleFavoriteClick}
              >
                {isFavorite && (<HeartIcon size={20} className="fill-white" />)}
                {!isFavorite && (<HeartOffIcon size={20} className="fill-white" />)}
                {/* <HeartIcon size={16} className="fill-white" /> */}
              </Button>
            )}
          </div>
          {/* TEXTO */}
          <div>
            <h3 className="text-sm font-semibold">{restaurant.name}</h3>
            {/* INFORMAÇÕES DA ENTREGA */}
            <div className="flex gap-3">
              {/* CUSTO DE ENTREGA */}
              <div className="flex items-center gap-1">
                <BikeIcon className="text-primary" size={14} />
                <span className="text-xs text-muted-foreground">
                  {Number(restaurant.deliveryFee) === 0
                    ? "Entrega grátis"
                    : formatCurrency(Number(restaurant.deliveryFee))}
                </span>
              </div>
              {/* TEMPO DE ENTREGA */}
              <div className="flex items-center gap-1">
                <TimerIcon className="text-primary" size={14} />
                <span className="text-xs text-muted-foreground">
                  {restaurant.deliveryTimeMinutes} min
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};

export default RestaurantItem;