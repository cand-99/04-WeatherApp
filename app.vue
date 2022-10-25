<script setup lang="ts">
import internal from "stream";

interface IIcon {
  icon: string;
}
interface ITemp {
  temp: number;
}
interface ICity {
  name: string;
  weather: IIcon;
  main: ITemp;
}

const cookie = useCookie("city");
if (!cookie.value) cookie.value = "tasikmalaya";

const search = ref(cookie.value);
const input = ref("");
const background = ref("");
const config = useRuntimeConfig()


// const { data: city, error } = useFetch<ICity>(
//   () =>
//     `https://api.openweathermap.org/data/2.5/weather?q=${search.value}&units=metric&appid=39b4a6ad75f0aa0f311519f6f4a824f4`)

const { data: city, error } = useAsyncData(
  "city",
  async () => {
    let response
    try{
      response = await $fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${search.value}`,
        {
          params:{
            units: "metric",
            appid: config.WEATHER_APP_SECRET
          },
        }
      );

      cookie.value = search.value;
      const temp = response.main.temp;
      if (temp <= 20) {
        background.value =
          "https://images.unsplash.com/photo-1519944159858-806d435dc86b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80";
      } else if (temp > 20 && temp <= 25) {
        background.value =
          "https://images.unsplash.com/photo-1556526945-0a2ef2955165?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80";
      } else {
        background.value =
          "https://images.unsplash.com/photo-1534171472159-edb6d1e0b63c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80";
      }
      
    } catch(e) {
      
    }
    return response;
  },
  {
    watch: [search],
  }
);

const handleClick = () => {
  const formatedDearch = input.value.trim().split(" ").join("+");
  search.value = formatedDearch;
  input.value = "";
};

const today = new Date()

const now = today.toLocaleDateString("en-US", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric"
})

const goBack = () =>{
  search.value = cookie.value;
};
</script>

<template>
  <div v-if="city" class="h-screen relative overflow-hidden">
    <img :src="background" alt="" class="w-full h-full object-cover" />
    <div class="absolute w-full h-full top-0 overlay" />
    <div class="absolute w-full h-full top-0 p-48">
      <div class="flex justify-between">
        <div>
          <h1 class="text-7xl text-white">{{ city.name }}</h1>
          <p class="font-extralight text-2xl mt-2 text-white">{{ now }}</p>
          <img
            :src="`https://openweathermap.org/img/wn/${city.weather[0].icon}@4x.png`"
            class="w-56 icon"
          />
        </div>
        <div>
          <p class="text-9xl text-white font-extralight">
            {{ city.main.temp }}°
          </p>
        </div>
      </div>
      <div class="mt-20 flex items-center">
        <input
          type="text"
          class="appearance-none rounded-none relative block px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 w-1/2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          placeholder="Search any city. . ."
          v-model="input"
        />
        <button
          class="bg-blue-500 text-white h-10 px-4 py-2 w-20"
          @click="handleClick()"
        >
          Search
        </button>
      </div>
    </div>
  </div>
  <div v-else class="min-h-screen grid place-items-center">
    <div class="text-center">
      <h1 class="text-7xl">Opss Can't find the city</h1>
      <button class="bg-gray-800 px-4 py-2 rounded-md text-white font-medium mt-4" @click="goBack">Go back</button>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  background-color: rgba(0, 0, 0, 0.5);
}

.icon {
  margin-left: -2.75rem;
  margin-top: 2.75rem;
}
</style>
