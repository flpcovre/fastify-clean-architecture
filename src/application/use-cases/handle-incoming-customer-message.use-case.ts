import { InboundCustomerMessageDto } from '@/application/dtos/inbound-customer-message.dto';
import { FindActiveCustomerChatUseCase } from '@/domain/chat/use-cases/find-active-customer-chat.use-case';
import { CreateCustomerMessageUseCase } from '@/domain/chat/use-cases/messages/create-customer-message.use-case';
import { CreateCustomerUseCase } from '@/domain/customer/use-cases/create-customer.use-case';
import { FindCustomerUseCase } from '@/domain/customer/use-cases/find-customer.use-case';

export class HandleIncomingCustomerMessageUseCase {
  constructor(
    private readonly findCustomerUseCase: FindCustomerUseCase,
    private readonly createCustomerUseCase: CreateCustomerUseCase,
    private readonly findActiveCustomerChatUseCase: FindActiveCustomerChatUseCase,
    private readonly createCustomerMessageUseCase: CreateCustomerMessageUseCase,
  ) {}

  public async execute(input: InboundCustomerMessageDto): Promise<void> {
    let customer = await this.findCustomerUseCase.execute({
      phone: input.from,
    });

    if (!customer) {
      customer = await this.createCustomerUseCase.execute({
        name: input.name,
        phone: input.from,
      });
    } else {
      const haveActiveChat = await this.findActiveCustomerChatUseCase.execute({
        customerId: customer.id,
      });

      if (haveActiveChat) {
        await this.createCustomerMessageUseCase.execute({
          chatId: haveActiveChat.id,
          content: input.content,
          type: input.type,
          whatsappKey: input.id,
          media: input.media,
        });
        return;
      }
    }

    // TODO: implement the logic to forward the message to some automated flow
    throw new Error('Customer does not have an active chat');
  }
}