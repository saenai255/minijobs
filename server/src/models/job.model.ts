import { Entity, TableInheritance, PrimaryGeneratedColumn, ManyToOne, Column, OneToMany, ManyToMany } from 'typeorm';
import { Category } from './category.model';
import { User } from './user.model';
import { File } from './file.model';
import { FileGUID } from './file-guid.model';

@Entity()
@TableInheritance({ column: { type: "varchar", name: "type" } })
export class Job {
  @PrimaryGeneratedColumn()
  id?: number;

  @ManyToOne(type => Category, category => category.listedJobs, { eager: true })
  category: Category;

  @Column({ nullable: false, length: 150 })
  name: string;

  @Column({ nullable: false, length: 1500 })
  description: string;

  @OneToMany(type => FileGUID, file => file.job, { eager: true })
  pictureGUIDs: FileGUID[];

  @ManyToMany(type => User, user => user.lastViewed)
  lastViewedBy?: User[];
}