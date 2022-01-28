const opentelemetry = require("@opentelemetry/sdk-node");
const { ZipkinExporter } = require("@opentelemetry/exporter-zipkin")
const { getNodeAutoInstrumentations } = require("@opentelemetry/auto-instrumentations-node");
const { SemanticResourceAttributes } =  require( "@opentelemetry/semantic-conventions");

const { RemixInstrumentation } = require("opentelemetry-instrumentation-remix");
const { PrismaClientInstrumentation}  = require("opentelemetry-instrumentation-prisma-client");

if (
  process.env.NODE_ENV === "development" ||
  process.env.NODE_ENV === undefined
) {
  const sdk = new opentelemetry.NodeSDK({
    resource: new opentelemetry.resources.Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: "remix-jokes",
    }),
    // traceExporter: new opentelemetry.tracing.ConsoleSpanExporter(),
    spanProcessor: new opentelemetry.tracing.BatchSpanProcessor(
      new ZipkinExporter({
        url: "http://localhost:9411/api/v2/spans",
      })
    ),
    instrumentations: [
      getNodeAutoInstrumentations(),
      new RemixInstrumentation(),
      new PrismaClientInstrumentation()
    ],
  });

  sdk.start().then(() => console.log("Tracing enabled"));
}
