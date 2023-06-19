import { Entity, UpdateDateColumn, CreateDateColumn } from 'typeorm';

@Entity()
export abstract class Audit {
  @CreateDateColumn({ type: 'timestamp with time zone', default: new Date() })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone', default: new Date() })
  updatedAt: Date;
}
