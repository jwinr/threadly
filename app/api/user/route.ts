import { NextRequest, NextResponse } from 'next/server'
import {
  findUserBySub,
  createStripeCustomer,
  createUser,
  createUserAttributesCookie,
} from '@/api/userService'

export async function POST(req: NextRequest) {
  try {
    const { sub, email, family_name, given_name } = await req.json()

    console.log('Received sub:', sub)
    console.log('Received email:', email)

    // Check if user already exists
    let customer = await findUserBySub(sub, req)

    if (customer) {
      const userAttributes = {
        email: customer.email,
        family_name,
        given_name,
        user_uuid: customer.user_uuid,
      }

      return NextResponse.json(
        {
          message: 'User already exists',
          userUuid: customer.user_uuid,
        },
        {
          status: 200,
          headers: {
            'Set-Cookie': createUserAttributesCookie(userAttributes),
          },
        },
      )
    } else {
      // Create a new Stripe customer
      const stripeCustomer = await createStripeCustomer(email, given_name, family_name)

      try {
        customer = await createUser(sub, email, family_name, given_name, stripeCustomer.id, req)

        const userAttributes = {
          email,
          family_name,
          given_name,
          user_uuid: customer.user_uuid,
        }

        return NextResponse.json(
          {
            message: 'User created',
            userUuid: customer.user_uuid,
          },
          {
            status: 201,
            headers: {
              'Set-Cookie': createUserAttributesCookie(userAttributes),
            },
          },
        )
      } catch (dbError: any) {
        if (dbError.code === '23505') {
          // Unique constraint violation
          customer = await findUserBySub(sub, req)

          const userAttributes = {
            email: customer?.email,
            family_name,
            given_name,
            user_uuid: customer?.user_uuid,
          }

          return NextResponse.json(
            {
              message: 'User already exists',
              userUuid: customer?.user_uuid,
            },
            {
              status: 200,
              headers: {
                'Set-Cookie': createUserAttributesCookie(userAttributes),
              },
            },
          )
        } else {
          throw dbError
        }
      }
    }
  } catch (error: any) {
    console.error('Error creating or fetching user:', error.stack)
    return NextResponse.json(
      {
        error: 'Error creating or fetching user',
        details: error.message,
      },
      { status: 500 },
    )
  }
}

export async function OPTIONS() {
  return NextResponse.json(null, {
    status: 200,
    headers: {
      Allow: 'POST',
    },
  })
}
