import {
  ErrorMessage,
  PaymentInformationMessage,
} from '@backend/systemmessagefactory';
import { Database } from '../../database/database';

export async function getCustomerId(userId: string) {
  const result = await Database.systemUserEntity.getCustomerId(userId);

  if (result.error) {
    return ErrorMessage.errorResponse(result.statusCode, result.error);
  }

  return PaymentInformationMessage.getCustomerIdResponse(
    result.statusCode,
    result.customerId,
  );
}

export async function setCustomerId(userId: string, customerId: string) {
  const result = await Database.systemUserEntity.setCustomerId(
    userId,
    customerId,
  );

  if (result.error) {
    return ErrorMessage.errorResponse(result.statusCode, result.error);
  }

  return PaymentInformationMessage.setCustomerIdResponse(result.statusCode);
}
