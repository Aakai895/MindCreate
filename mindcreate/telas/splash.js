import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import Rotas from "./rotas";

export default function App() {
  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
        // carregamentos iniciais aqui...
      } finally {
        if (mounted) await SplashScreen.hideAsync();
      }
    };
    run();
    return () => { mounted = false; };
  }, []);

  return (
    <NavigationContainer>
      <Rotas />
    </NavigationContainer>
  );
}
