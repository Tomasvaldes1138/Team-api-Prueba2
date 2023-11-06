import { returnErrorResponse } from '../../../src/errors/error-response';
import SubscriptionLogic from '../../../src/business-logic/subscription';
import listSubscriptions from '../../../src/controllers/club/list-subscriptions.controller';

jest.mock('../../../src/errors/error-response');
jest.mock('../../../src/business-logic/subscription');

describe('Controller: Club: list subscriptions', () => {
  let req, res;

  beforeEach(() => {
    req = {
      userId: 'user-id',
      params: { clubId: 'club-id' },
    };
    res = {
      send: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a list of subscriptions when successful', async () => {
    const mockSubscriptions = ['Subscription1', 'Subscription2', 'Subscription3'];
    SubscriptionLogic.listByClub.mockResolvedValue(mockSubscriptions);
    await listSubscriptions(req, res);
    expect(res.send).toHaveBeenCalledWith({ subscriptions: mockSubscriptions });
  });

  it('should return an error when subscription logic fails', async () => {
    const mockError = new Error('Subscription error');
    SubscriptionLogic.listByClub.mockRejectedValue(mockError);
    await listSubscriptions(req, res);
    expect(returnErrorResponse).toHaveBeenCalledWith({ error: mockError, res });
  });
});
