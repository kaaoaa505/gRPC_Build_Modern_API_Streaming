var grpc = require("@grpc/grpc-js");

var greet_pb = require("../build/proto/greet_pb");
var greet_grpc_pb = require("../build/proto/greet_grpc_pb");

var calc_pb = require("../build/proto/calc_pb");
var calc_grpc_pb = require("../build/proto/calc_grpc_pb");

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
  greetObj.setLastName("Allam");

  var greetObj2 = new greet_pb.Greeting();
  greetObj2.setFirstName("Ahmed");
  greetObj2.setLastName("Omar");

  var greet_request = new greet_pb.GreetRequest();
  greet_request.setGreeting(greetObj);

  var greet_request2 = new greet_pb.GreetRequest();
  greet_request2.setGreeting(greetObj2);

  var call = greet_client.greetStream(greet_request, () => {});
  var call2 = greet_client.greetStream(greet_request2, () => {});

  call.on("data", (response) => {
    console.log("✅ Greeting Stream Response is: ", response.getResult());
  });

  call.on("status", (status) => {
    console.info(`---- Status is: `, status);
  });

  call.on("error", (error) => {
    console.error(`---- error is: `, error);
  });

  call.on("end", () => {
    console.info(`---- Greeting Stream Response END ----`);
  });

  call2.on("data", (response) => {
    console.log("✅ Greeting Stream Response is: ", response.getResult());
  });

  call2.on("status", (status) => {
    console.info(`---- Status is: `, status);
  });

  call2.on("error", (error) => {
    console.error(`---- error is: `, error);
  });

  call2.on("end", () => {
    console.info(`---- Greeting Stream Response END ----`);
  });
}

function call_greet_custom_service() {
  console.info(`---- Custom Greeting Response START ----`);

  var greet_client = new greet_grpc_pb.GreetServiceClient(
    "localhost:50051",
    grpc.credentials.createInsecure()
  );

  var greet_request = new greet_pb.GreetRequest();

  var call = greet_client.customGreetStream(
    greet_request,
    (error, response) => {
      if (!error) {
        console.log("✅ Custom Greeting Response is: ", response.getResult());
      } else {
        console.log("✅ Custom Greeting Response -ERROR- is: ", error);
      }
    }
  );

  call.on("data", (response) => {
    console.log("✅ Custom Greeting data Response is: ", response);
  });

  call.on("status", (status) => {
    console.info(`---- Status is: `, status);
  });

  call.on("error", (error) => {
    console.error(`---- error is: `, error);
  });

  call.on("end", () => {
    console.info(`---- Custom Greeting Response END ----`);
  });

  let i = 0;
  let intervalId = setInterval(() => {
    i++;

    var req = new greet_pb.GreetRequest();

    var greetObj = new greet_pb.Greeting();
    greetObj.setFirstName("Khaled-" + i);
    greetObj.setLastName("\tAllam-" + i);

    req.setGreeting(greetObj);

    call.write(req);

    if (i > 7) {
      clearInterval(intervalId);
      call.end();
    }
  }, 1000);

  console.info(`---- Custom Greeting Response END ----`);
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
    console.info(`---- Status is: `, status);
  });

  call.on("error", (error) => {
    console.error(`---- error is: `, error);
  });

  call.on("end", () => {
    console.info(
      `---- Calc Prime Number Decomposition Stream Response END ----`
    );
  });
}

function call_compute_average_service() {
  console.log(`---- Compute Average Stream Response START ----`);
  var calc_client = new calc_grpc_pb.calcServiceClient(
    "localhost:50051",
    grpc.credentials.createInsecure()
  );

  var request = new calc_pb.ComputeAverageRequest();
  var call = calc_client.computeAverage(request, (error, response) => {
    if(!error){
      console.log('✅ response.getAverageResult()    ', response.getAverageResult())
      
    }else{
      console.error(error);
    }
  });

  var req1 = new calc_pb.ComputeAverageRequest();
  var req2 = new calc_pb.ComputeAverageRequest();
  var req3 = new calc_pb.ComputeAverageRequest();

  req1.setNumber(6);
  req2.setNumber(10);
  req3.setNumber(20);

  call.write(req1);
  call.write(req2);
  call.write(req3);

  call.end();

  console.info(`---- Compute Average Stream Response END ----`);
}

function main() {
  // call_greet_service();
  // call_greet_stream_service();
  // call_greet_custom_service();
  // call_calc_service();
  // call_prime_number_decomposition_service();
  call_compute_average_service();
}
main();
