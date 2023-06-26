var grpc = require("@grpc/grpc-js");

var greet_pb = require("../build/proto/greet_pb");
var greet_grpc_pb = require("../build/proto/greet_grpc_pb");

var calc_pb = require("../build/proto/calc_pb");
var calc_grpc_pb = require("../build/proto/calc_grpc_pb");

function greet(call, callback) {
  var response = new greet_pb.GreetResponse();

  response.setResult(
    "Hello, " +
      call.request.getGreeting().getFirstName() +
      " " +
      call.request.getGreeting().getLastName()
  );

  callback(null, response);
}

function greetStream(call, _callback) {
  var first_name = call.request.getGreeting().getFirstName();
  var last_name = call.request.getGreeting().getLastName();

  let count = 0;
  let intervalId = setInterval(function () {
    var response = new greet_pb.GreetResponse();
    response.setResult(count + "- Hello, " + first_name + " " + last_name);

    call.write(response);

    if (++count > 5) {
      clearInterval(intervalId);
      call.end();
    }
  }, 1000);
}

function customGreetStream(call, _callback) {
  call.on("data", (request) => {
    var first_name = request.getGreeting().getFirstName();
    var last_name = request.getGreeting().getLastName();
    var full_name = first_name + " " + last_name;

    console.log('✅ customGreetStream full_name is: ', full_name);
  });

  call.on("status", (status) => {
    console.info(`---- customGreetStream Status is: `, status);
  });

  call.on("error", (error) => {
    console.error(`---- customGreetStream error is: `, error);
  });

  call.on("end", () => {
    console.info(`---- customGreetStream Response END ----`);
  });
}

function sum(call, callback) {
  var response = new calc_pb.SumResponse();

  response.setSumResult(
    call.request.getFirstNumber() + call.request.getSecondNumber()
  );

  callback(null, response);
}

function primeNumberDecomposition(call, _callback) {
  var num = call.request.getNumber();
  let divisor = 2;

  while (num > 1 && num > divisor) {
    if (num % divisor === 0) {
      var response = new calc_pb.PrimeNumberDecompositionResponse();
      response.setDecompositionResult(divisor);

      num = num / divisor;

      call.write(response);

      call.end();
    } else {
      divisor++;

      console.log("---- Divisor increased to be: ", divisor);
    }
  }
}

function main() {
  var server = new grpc.Server();

  server.addService(greet_grpc_pb.GreetServiceService, {
    greet: greet,
    greetStream: greetStream,
    customGreetStream: customGreetStream,
  });

  server.addService(calc_grpc_pb.calcServiceService, {
    sum: sum,
    primeNumberDecomposition: primeNumberDecomposition,
  });

  server.bindAsync(
    "127.0.0.1:50051",
    grpc.ServerCredentials.createInsecure(),
    () => {
      server.start();
      console.log("✅ Server started:  127.0.0.1:50051");
    }
  );
}
main();
