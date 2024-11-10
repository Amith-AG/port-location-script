import connectMongoDB from "@/libs/mongodb";
import ports from "@/models/port-schema";
import { NextResponse } from "next/server";

const googleApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;

export async function POST(request: Request) {
  try {
    // Connect to MongoDB
    await connectMongoDB();

    // Extract data from the request body (assuming JSON format)
    const requestBody = await request.json();
    const { port_code, port_name, port_type, country } = requestBody;

    console.log(port_code + " " + port_name + " " + port_type + " " + country);
    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${port_name}&components=country:${country}&key=${googleApiKey}`;

    const response = await fetch(apiUrl);

    if (response.ok) {
      const responseData = await response.json(); // Parse the JSON response
      // console.log(responseData);

      if (responseData.status === "OK") {
        const results = responseData.results[0];
        const { geometry, address_components } = results;
        const { lat, lng } = geometry.location;
        console.log("Geocoding data:", lat, lng);

        // Create a new document for Collection B
        const documentB = new ports({
          port_code: port_code,

          port_type: port_type,
          location: {
            type: "Point",
            coordinates: [lng, lat],
          },
        });

        // Save the new document to Collection B
        await documentB.save();
        console.log("Data inserted successfully");
        return NextResponse.json({ message: "Data inserted successfully" });
      } else {
        console.error(
          "Google Geocoding API did not return OK status:",
          responseData.status
        );
        return NextResponse.json({
          message: "Google Geocoding API did not return OK status:",
        });
      }
    } else {
      console.error(
        "Google Geocoding API request failed with status:",
        response.status
      );
    }
  } catch (error) {
    console.error("Error migrating data:", error);
    return NextResponse.json({
      message: "Google Geocoding API did not return OK status:",
    });
  }
}
