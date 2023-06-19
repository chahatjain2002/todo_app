import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Audit } from '../database-audit/audit.entity';
import { Role } from '../role/role.entity';
import { Task } from '../tasks/task.entity';

@Entity()
export class User extends Audit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null })
  name: string;

  @Column({
    length: 255,
    unique: true,
  })
  email: string;

  @Column({
    length: 100,
  })
  password: string;

  @ManyToMany(() => Role)
  @JoinTable({
    name: 'user_role',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: Promise<Role[]>;

  @OneToMany(() => Task, (task) => task.user)
  tasks: Promise<Task[]>;
}
