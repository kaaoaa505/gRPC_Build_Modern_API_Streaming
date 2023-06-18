var grpc = require("@grpc/grpc-js");

var greet_pb = require("../server/proto/greet_pb");
var greet_grpc_pb = require("../server/proto/greet_grpc_pb");

var calc_pb = require("../server/proto/calc_pb");
var calc_grpc_pb = require("../server/proto/calc_grpc_pb");

function call_greet_service() {
  var greet_client = new greet_grpc_pb.GreetServiceClient(
    "localhost:50051",
    grpc.credentials.createInsecure()
  );

  var greetObj = new greet_pb.Greeting();
  greetObj.setFirstName("Khaled");
  greetObj.setLastName("Allam");

  var greet_request = new greet_pb.GreetRequest();
  greet_request.setGreeting(greetObj);

  greet_client.greet(greet_request, (error, response) => {
    if (!error) {
      console.log("✅ Greeting Response is: ", response.getResult());
    } else {
      console.log("✅ Greeting Response -ERROR- is: ", error);
    }
  });
}

function call_greet_stream_service() {
  console.log(`---- Greeting Stream Response START ----`);

  var greet_client = new greet_grpc_pb.GreetServiceClient(
    "localhost:50051",
    grpc.credentials.createInsecure()
  );

  var greetObj = new greet_pb.Greeting();
  greetObj.setFirstName("Khaled");
  greetObj.setLastName("Allam Ahmed Abdalla");

  var greet_request = new greet_pb.GreetStreamRequest();
  greet_request.setGreeting(greetObj);

  var call = greet_client.greetStream(greet_request, () => {});

  call.on("data", (response) => {
    console.log("✅ Greeting Stream Response is: ", response.getResult());
  });

  call.on("status", (status) => {
    console.log(`---- Status is: `, status);
  });

  call.on("error", (error) => {
    console.log(`---- error is: `, error);
  });

  call.on("end", () => {
    console.log(`---- Greeting Stream Response END ----`);
  });
}

function call_calc_service() {
  var calc_client = new calc_grpc_pb.calcServiceClient(
    "localhost:50051",
    grpc.credentials.createInsecure()
  );

  var calc_request = new calc_pb.SumRequest();
  calc_request.setFirstNumber(200900);
  calc_request.setSecondNumber(700100);

  calc_client.sum(calc_request, (error, response) => {
    if (!error) {
      console.log("✅ Sum Response is: ", response.getSumResult());
      console.log(
        calc_request.getFirstNumber() +
          ` + ` +
          calc_request.getSecondNumber() +
          ` = ` +
          response.getSumResult()
      );
    } else {
      console.log("✅ Sum Response -ERROR- is: ", error);
    }
  });
}

function call_prime_number_decomposition_service() {
  console.log(
    `---- Calc Prime Number Decomposition Stream Response START ----`
  );
  var calc_client = new calc_grpc_pb.calcServiceClient(
    "localhost:50051",
    grpc.credentials.createInsecure()
  );
  var calc_request = new calc_pb.PrimeNumberDecompositionRequest();
  calc_request.setNumber(6);

  var call = calc_client.primeNumberDecomposition(calc_request, () => {});

  call.on("data", (response) => {
    console.log(
      "✅ Calc Prime Number Decomposition Stream Response is: ",
      response.getDecompositionResult()
    );
  });

  call.on("status", (status) => {
    console.log(`---- Status is: `, status);
  });

  call.on("error", (error) => {
    console.log(`---- error is: `, error);
  });

  call.on("end", () => {
    console.log(
      `---- Calc Prime Number Decomposition Stream Response END ----`
    );
  });
}

function main() {
  call_greet_service();
  call_greet_stream_service();
  call_calc_service();
  call_prime_number_decomposition_service();
}
main();
