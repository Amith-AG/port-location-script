import { NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongodb";
import ports from "@/models/port-schema";

export async function GET() {
  try {
    await connectMongoDB();

    // Fetch data from Collection A
    const dataFromCollectionA = await ports.find().exec();

    // Iterate through each document
    for (const documentA of dataFromCollectionA) {
      // Perform geocoding using Google Maps API based on 'port_code' from documentA
      const { port_code, port_name, port_type } = documentA;

      console.log(port_code + " " + port_name + " " + port_type);

      // Create a request to the /api/createCollection endpoint for each document

      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          port_code,
          port_name,
          port_type,
          country: "in",
        }),
      };

      // Send a POST request to /api/createCollection for each document
      const createCollectionResponse = await fetch(
        "http:localhost:3000/api/google-location",
        requestOptions
      );

      // Check the response and handle errors as needed
      if (createCollectionResponse.status !== 201) {
        console.error("Error creating collection for document:", documentA);
      }
    }

    // Send a success response for fetching data
    NextResponse.json({ message: "Data fetched and processed successfully" }),
      { status: 200 };
  } catch (error) {
    console.error("Error fetching and processing data:", error);
    NextResponse.json({ message: "Internal server error" });
  }
}
