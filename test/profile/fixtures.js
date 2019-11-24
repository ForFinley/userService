const url = '/identity-service/profile';
const userId = 'c7ab0565-832e-4c22-9518-c2f3a038572e';
const email = 'profileemail@test.com';
const authorization =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjN2FiMDU2NS04MzJlLTRjMjItOTUxOC1jMmYzYTAzODU3MmUiLCJlbWFpbCI6InByb2ZpbGVlbWFpbEB0ZXN0LmNvbSIsInJvbGUiOiJQRUFTQU5UIiwiaWF0IjoxNTUzODEwNjIxfQ.KJEaub6Tl4ZGRQVNyGTU2DqBYRVwaJ4RDWZQjMhL43E';
const billingAddress = {
  line1: '34 test street',
  line2: '',
  city: 'Manhattan',
  state: 'NY',
  zipCode: '10012',
  country: 'USA'
};
const creditCard = {
  provider: 'STRIPE',
  brand: 'VISA',
  exp: '04/2020',
  last4: '3049',
  cardId: 'card_1EC96AJlYBbOBpxRpL3cA67L'
};

exports.profileRecord = {
  userId,
  email,
  billingAddress,
  creditCard
};

exports.profileFixture = {
  url,
  headers: { authorization },
  body: {}
};

exports.profileFixtureBadToken = {
  url,
  headers: {},
  body: {}
};

exports.profileFixtureBadUser = {
  url,
  headers: {
    authorization:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiItODMyZS00YzIyLTk1MTgtYzJmM2EwMzg1NzJlIiwiZW1haWwiOiJDUkFQTUFJTEB0ZXN0LmNvbSIsInJvbGUiOiJQRUFTQU5UIiwiaWF0IjoxNTUzNDkxODk5fQ.voUcMZmAWzN_D1ZtAa14IHPi5z9uW0iJb8rVqC--gbQ'
  },
  body: {}
};
