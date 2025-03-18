export enum Workflow_Step_Condition_Enum {
  ANY = "any",
  REJECT = "reject",
  APPROVE = "approve",
}

export enum Workflow_field_Condition_Enum {
  EQUALS = "equals",                
  NOT_EQUALS = "not_equals",         
  GREATER_THAN = "greater_than",     
  LESS_THAN = "less_than",          
  GREATER_THAN_OR_EQUAL = "greater_than_or_equal", 
  LESS_THAN_OR_EQUAL = "less_than_or_equal",       

  BEFORE = "before",                
  AFTER = "after",                  
  ON = "on",                         

  IS_NULL = "is_null",               
  IS_NOT_NULL = "is_not_null",       
}


export enum Workflow_logic_Condition_Enum {
  AND = "and",
  OR = "or",
}