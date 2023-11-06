import { returnErrorResponse } from '../../../src/errors/error-response';
import SubscriptionLogic from '../../../src/business-logic/subscription';
import { addValidation } from '../../../src/validations/subscription.validations';
import addSubscription from '../../../src/controllers/club/add-subscription.controller';

jest.mock('../../../src/errors/error-response');
jest.mock('../../../src/business-logic/subscription');
jest.mock('../../../src//validations/subscription.validations');

describe('Controller: Club: add subscription', () => {
    let req, res;
  
    beforeEach(() => {
      req = {
        body: { name: 'John Doe' },
        params: { clubId: 'club-id' },
        userId: 'user-id',
      };
      res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('should return a subscription when creation is successful', async () => {
      const mockSubscription = { id: 'subscription-id', name: 'John Doe' };
      SubscriptionLogic.create.mockResolvedValue(mockSubscription);
      await addSubscription(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith({ subscription: mockSubscription });
    });
  
    it('should return an error when subscription validation fails', async () => {
      const mockError = new Error('Validation error');
      addValidation.validateAsync.mockRejectedValue(mockError);
      await addSubscription(req, res);
      expect(returnErrorResponse).toHaveBeenCalledWith({ error: mockError, res });
    });
  
  });