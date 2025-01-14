const jwt = require('jsonwebtoken')

const accessKey = {
	developer_id: "c6b30377-3bbe-4ab3-b2d6-0fd3d9e352db", // Replace with your Developer ID
	key_id: "645fa798-0e24-4b95-a1a7-1b8b870f7a7f",            // Replace with your Key ID
	signing_secret: "XB2C5lzAH_2wxumpLhLLRVy6wZd2wuFiF7O9PeAVKac", // Replace with your Signing Secret
};

const data = {
	aud: 'doordash',
	iss: accessKey.developer_id,
	kid: accessKey.key_id,
	exp: Math.floor(Date.now() / 1000 + 300),
	iat: Math.floor(Date.now() / 1000),
}

const headers = { algorithm: 'HS256', header: { 'dd-ver': 'DD-JWT-V1' } }

const token = jwt.sign(
	data,
	Buffer.from(accessKey.signing_secret, 'base64'),
	headers,
)

console.log(token)

const axios = require('axios')

const body = JSON.stringify({
	external_delivery_id: 'D-12345',
	pickup_address: '901 Market Street 6th Floor San Francisco, CA 94103',
	pickup_business_name: 'Wells Fargo SF Downtown',
	pickup_phone_number: '+16505555555',
	pickup_instructions: 'Enter gate code 1234 on the callbox.',
	dropoff_address: '901 Market Street 6th Floor San Francisco, CA 94103',
	dropoff_business_name: 'Wells Fargo SF Downtown',
	dropoff_phone_number: '+16505555555',
	dropoff_instructions: 'Enter gate code 1234 on the callbox.',
	order_value: 1999,
})

axios
	.get('https://openapi.doordash.com/developer/v1/businesses/biz-27551630/stores/store-27551630', {
		headers: {
			Authorization: 'Bearer ' + token,
			'Content-Type': 'application/json',
		},
	})
	.then(function (response) {
		console.log(response.data)
	})
	.catch(function (error) {
		console.log(error)
	})