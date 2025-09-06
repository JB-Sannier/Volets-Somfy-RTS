import path from "path";
import { Configuration } from "webpack";
import nodeExternals from "webpack-node-externals";

const { NODE_ENV = "production" } = process.env;

type Mode = "production" | "development" | "none";

const mode: Mode =
  NODE_ENV.toLowerCase() === "production"
    ? "production"
    : NODE_ENV.toLowerCase() === "development"
      ? "development"
      : "none";

const config: Configuration = {
  mode,
  target: "node",
  devtool: mode === "development" ? "inline-source-map" : undefined,
  entry: {
    "authentication-service": "./src/index.ts",
  },
  externalsPresets: { node: true },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              configFile: "tsconfig.json",
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    path: path.resolve(__dirname, "bundle"),
    filename: "[name].js",
  },
};

export default config;
