/* import { request } from 'supertest';
import { expect } from 'chai';
import userRouter from '../router/userRouter.js';


//const should = chai.should();


//chai.use(chaiHttp);


describe('GET /users', () => {
    it('should return a list of users with pagination', async () => {
      const response = await request(app)
       .get('/users?page=1&limit=5')
       .set('Authorization', 'Bearer your_token_here'); // Replace with your actual token
  
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an('array');
      expect(response.body.length).to.be.at.most(5); // Assuming you have at least 5 users in your database
    });
  
    it('should return an empty array when page and limit are not provided', async () => {
      const response = await request(app)
       .get('/users?page=&limit=')
       .set('Authorization', 'Bearer your_token_here'); // Replace with your actual token
  
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an('array');
      expect(response.body.length).to.equal(0); // Assuming there are no users in your database
    });
  
    // Add more test cases as needed
  }); */