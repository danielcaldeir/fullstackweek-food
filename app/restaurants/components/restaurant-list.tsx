import { db } from "@/lib/prisma";
import RestaurantItem from "@/app/restaurants/components/restaurant-item";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const RestaurantList = async () => {
  const session = await getServerSession(authOptions);

    // TODO: pegar restaurantes com maior número de pedidos
    const restaurants = await db.restaurant.findMany({ take: 10 });
    const userFavoriteRestaurants = await db.userFavoriteRestaurant.findMany({
      where: { userId: session?.user?.id },
    });
  
    console.log(userFavoriteRestaurants);
    return (
      <div className="flex gap-4 overflow-x-scroll px-5 [&::-webkit-scrollbar]:hidden">
        {restaurants.map((restaurant) => (
          <RestaurantItem 
            key={restaurant.id}
            restaurant={restaurant}
            // userId={session?.user?.id}
            userFavoriteRestaurants={userFavoriteRestaurants}
          />
        ))}
      </div>
    );
};

export default RestaurantList;