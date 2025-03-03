import { RepoFactory } from "../shared";
import { unitEnum } from "../shared/enums/project.unit.enum";
import { UnitRepository } from "../unit/unit.repository";

const unitRepo = RepoFactory.getRepo<UnitRepository>("unit");


export async function unitSeeder() {
   ///////edu unit 
  const eduUnit = unitEnum.EDU_UNIT;

  const eduexists = await unitRepo.findOne({
    name: eduUnit,
  });

  if (!eduexists) {
    await unitRepo.create({ name: eduUnit });
  }
////ictUnit
  const ictUnit = unitEnum.ICT_TRADE_UNIT;
  const IctExist = await unitRepo.findOne({
    name:ictUnit
  })
  if(!IctExist){
    await unitRepo.create({name:ictUnit})
  }

/////portal

const portalUnit = unitEnum.PORTAL_UNIT
const portalExist = await unitRepo.findOne({
    name:portalUnit
})
if(!portalExist){
    await unitRepo.create({name:portalUnit})
}
///foreign trade Unit


const foreignTradeUnit = unitEnum.FOREIGN_TRADE_UNIT

const foreignExist = await unitRepo.findOne({
    name:foreignTradeUnit
})
if(!foreignExist){
    await unitRepo.create({name:foreignTradeUnit})
}
}