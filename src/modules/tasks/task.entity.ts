import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Audit } from '../database-audit/audit.entity';
import { User } from '../user/user.entity';

@Entity()
export class Task extends Audit {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.tasks)
  user: Promise<User>;

  @Column({ unique: true })
  title: string;

  @Column()
  description: string;

  @Column()
  priority: string;

  @Column({ default: false })
  status: boolean;

  @Column()
  dueDate: string;
}
