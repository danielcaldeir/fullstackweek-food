// "use client";
// import { Restaurant } from "@prisma/client";
// import { notFound, useSearchParams } from "next/navigation";
// import { Suspense, useEffect, useState } from "react";
// import { searchForRestaurants } from "./actions/search";
// import Header from "@/components/header";
// import RestaurantItem from "@/components/restaurant-item";
import { Suspense } from "react";
import Restaurants from "@/app/restaurants/components/restaurants";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma";
import Header from "@/components/header";

// const Restaurants = () => {
//     const searchParams = useSearchParams();
//     const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
//     const searchFor = searchParams.get("search");
  
//     useEffect(() => {
//       const fetchRestaurants = async () => {
//         if (!searchFor) return;
//         const foundRestaurants = await searchForRestaurants(searchFor);
//         setRestaurants(foundRestaurants);
//       };
//       fetchRestaurants();
//     }, [searchFor]);
  
//     if (!searchFor) {
//       return notFound();
//     }
  
//     return (
//       <>
//         <Header />
//         <div className="px-5 py-6">
//           <h2 className="mb-6 text-lg font-semibold">Restaurantes Encontrados</h2>
//           <div className="flex w-full flex-col gap-6">
//             {restaurants.map((restaurant) => (
//               <RestaurantItem
//                 key={restaurant.id}
//                 restaurant={restaurant}
//                 className="min-w-full max-w-full"
//               />
//             ))}
//           </div>
//         </div>
//       </>
//     );
// };

const RestaurantsPage = async () =>{
  const session = await getServerSession(authOptions);

  const userFavoriteRestaurants = await db.userFavoriteRestaurant.findMany({
    where: { 
      userId: session?.user?.id 
    },
    include: {
      restaurant: true,
    },
  });

  return (
    <Suspense>
      {/* <Header /> */}
      <Restaurants userFavoriteRestaurants={userFavoriteRestaurants}/>
    </Suspense>
  );
}

export default RestaurantsPage;

// export default Restaurants;