import {
  findUserBySub,
  createStripeCustomer,
  createUser,
  createUserAttributesCookie,
} from "@/api/userService"

export async function POST(req) {
  try {
    const { sub, email, family_name, given_name } = await req.json()

    console.log("Received sub:", sub)
    console.log("Received email:", email)

    // Check if user already exists
    let customer = await findUserBySub(sub)

    if (customer.length > 0) {
      const userAttributes = {
        email: customer[0].email,
        family_name,
        given_name,
        user_uuid: customer[0].user_uuid,
      }

      return new Response(
        JSON.stringify({
          message: "User already exists",
          userUuid: customer[0].user_uuid,
        }),
        {
          status: 200,
          headers: {
            "Set-Cookie": createUserAttributesCookie(userAttributes),
            "Content-Type": "application/json",
          },
        }
      )
    } else {
      // Create a new Stripe customer
      const stripeCustomer = await createStripeCustomer(
        email,
        given_name,
        family_name
      )

      try {
        customer = await createUser(
          sub,
          email,
          family_name,
          given_name,
          stripeCustomer.id
        )

        const userAttributes = {
          email,
          family_name,
          given_name,
          user_uuid: customer[0].user_uuid,
        }

        return new Response(
          JSON.stringify({
            message: "User created",
            userUuid: customer[0].user_uuid,
          }),
          {
            status: 201,
            headers: {
              "Set-Cookie": createUserAttributesCookie(userAttributes),
              "Content-Type": "application/json",
            },
          }
        )
      } catch (dbError) {
        if (dbError.code === "23505") {
          // Unique constraint violation
          customer = await findUserBySub(sub)

          const userAttributes = {
            email: customer[0].email,
            family_name,
            given_name,
            user_uuid: customer[0].user_uuid,
          }

          return new Response(
            JSON.stringify({
              message: "User already exists",
              userUuid: customer[0].user_uuid,
            }),
            {
              status: 200,
              headers: {
                "Set-Cookie": createUserAttributesCookie(userAttributes),
                "Content-Type": "application/json",
              },
            }
          )
        } else {
          throw dbError
        }
      }
    }
  } catch (error) {
    console.error("Error creating or fetching user:", error.stack)
    return new Response(
      JSON.stringify({
        error: "Error creating or fetching user",
        details: error.message,
      }),
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      Allow: "POST",
    },
  })
}
