import type { CapacitorConfig } from "@capacitor/cli";

const isWANBuild = process.env.WAN_BUILD === "1";
const buildEnv = isWANBuild ? "wan" : "lan";

const config: CapacitorConfig = {
  appId: `fr.jsannier.somfy_rts_shutters_${buildEnv}`,
  appName: `Somfy RTS Shutters - ${isWANBuild ? "Wan" : "Lan"}`,
  webDir: isWANBuild ? "../frontend/build-wan/" : "../frontend/build-lan",

  android: {
    allowMixedContent: true,
    flavor: buildEnv,
    buildOptions: {
      releaseType: "APK",
    },
  },
  server: {
    androidScheme: "http",
  },
};

export default config;
