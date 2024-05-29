"use client";

// import { toggleFavoriteRestaurant } from "@/app/actions/restaurant";
import { isRestaurantFavorited } from "@/app/helpers/restaurant";
import useToggleFavoriteRestaurant from "@/app/hooks/use-toggle-favorite-restaurant";
import { Button } from "@/components/ui/button";
import { Restaurant, UserFavoriteRestaurant } from "@prisma/client";
import { ChevronLeftIcon, HeartIcon, HeartOffIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
// import { toast } from "sonner";

interface RestaurantImageProps {
    restaurant: Pick<Restaurant, "id" | "name" | "imageUrl">;
    // restaurant: Restaurant;
    userFavoriteRestaurants: UserFavoriteRestaurant[];
}

const RestaurantImage = ({ restaurant, userFavoriteRestaurants, }: RestaurantImageProps) => {
    const router = useRouter();
    const { data } = useSession();
  
    const isFavorite = isRestaurantFavorited(
      restaurant.id,
      userFavoriteRestaurants,
    );

    const handleBackClick = () => router.back();
    const { handleFavoriteClick } = useToggleFavoriteRestaurant({
      restaurantId: restaurant.id,
      userId: data?.user.id,
      restaurantIsFavorited: isFavorite,
    });
    
    // const handleFavoriteClick = async () => {
    //   // if (!userId) return;
    //   if (!data?.user.id) return;
    //   try {
    //     await toggleFavoriteRestaurant(data?.user.id, restaurant.id);
    //     toast.success(
    //       isFavorite
    //         ? "Restaurante removido dos favoritos."
    //         : "Restaurante favoritado.",
    //     );
    //   } catch (error) {
    //     toast.error("Erro ao favoritar restaurante.");
    //   }
    // };

    return (
      <div className="relative h-[250px] w-full">
        <Image
          src={restaurant.imageUrl}
          alt={restaurant.name}
          fill
          className="object-cover"
        />
  
        <Button
          className="absolute left-4 top-4 rounded-full bg-white text-foreground hover:text-white"
          size="icon"
          onClick={handleBackClick}
        >
          <ChevronLeftIcon />
        </Button>
  
        {data?.user.id && (
        <Button
          size="icon"
          className={`absolute right-4 top-4 rounded-full bg-gray-700 ${isFavorite && 'bg-primary hover:bg-gray-700'}`}
          onClick={handleFavoriteClick}
        >
          {isFavorite && (<HeartIcon size={20} className="fill-white" />)}
          {!isFavorite && (<HeartOffIcon size={20} className="fill-white" />)}
          {/* <HeartIcon size={20} className="fill-white" /> */}
        </Button>
        )}
        
      </div>
    );
};

export default RestaurantImage;