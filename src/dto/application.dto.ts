export class Application {
  id: number;
  filling: Date;
  senderId: number; //sender is user only
  description: string;
  status: 'open' | 'inProcess' | 'closed' | 'refused';
  specialist?: string;
  refusedDescription?: string;
}

export class ApplicationAdd {
  senderId?: number;
  description: string;
}
