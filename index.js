#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  default: () => src_default,
  generator: () => generator
});
module.exports = __toCommonJS(src_exports);

// src/globals/index.ts
var generatorName = "Drizzle Prisma generator";
var defaultPath = "./src/drizzle/";

// src/index.ts
var import_generator_helper4 = require("@prisma/generator-helper");
var import_path2 = __toESM(require("path"));

// package.json
var version = "0.1.7";

// src/util/escape/index.ts
var backslashes = new RegExp(/\\/g);
var s = (src, container = "'") => src.replace(backslashes, "\\\\").replace(new RegExp(container, "g"), `\\${container}`);

// src/util/extract-many-to-many-models/index.ts
var sorted = (list, sortFunction) => {
  const newList = [...list];
  newList.sort(sortFunction);
  return newList;
};
var generateModels = (manyToManyFields, models, manyToManyTables = []) => {
  const manyFirst = manyToManyFields.shift();
  if (!manyFirst) {
    return manyToManyTables;
  }
  const manySecond = manyToManyFields.find((field) => field.relationName === manyFirst.relationName);
  if (!manySecond) {
    return manyToManyTables;
  }
  manyToManyTables.push({
    dbName: `_${manyFirst.relationName}`,
    name: manyFirst.relationName || "",
    primaryKey: null,
    uniqueFields: [],
    uniqueIndexes: [],
    fields: generateJoinFields([manyFirst, manySecond], models)
  });
  return generateModels(
    manyToManyFields.filter((field) => field.relationName !== manyFirst.relationName),
    models,
    manyToManyTables
  );
};
var generateJoinFields = (fields, models) => {
  const [A, B] = sorted(fields, (a, b) => a.type.localeCompare(b.type));
  const aTableName = B.type;
  const bTableName = A.type;
  const manyTableName = `${A.type}To${B.type}`;
  A.isList = true;
  A.type = `${bTableName}To${aTableName}`;
  A.relationName = `${aTableName}To${manyTableName}`;
  A.relationFromFields = [];
  A.relationToFields = [];
  B.isList = true;
  B.type = `${bTableName}To${aTableName}`;
  B.relationName = `${bTableName}To${manyTableName}`;
  A.relationFromFields = [];
  A.relationToFields = [];
  return [
    {
      name: `${aTableName}Id`,
      dbName: "A",
      type: getJoinIdType(aTableName, models),
      kind: "scalar",
      isRequired: true,
      isList: false,
      isUnique: false,
      isId: false,
      isReadOnly: true,
      hasDefaultValue: false
    },
    {
      name: aTableName,
      type: aTableName,
      kind: "object",
      isRequired: true,
      isList: false,
      isUnique: false,
      isId: false,
      isReadOnly: true,
      hasDefaultValue: false,
      relationName: `${aTableName}To${manyTableName}`,
      relationFromFields: [`${aTableName}Id`],
      relationToFields: [getJoinIdName(aTableName, models)]
    },
    {
      name: `${bTableName}Id`,
      dbName: "B",
      type: getJoinIdType(bTableName, models),
      kind: "scalar",
      isRequired: true,
      isList: false,
      isUnique: false,
      isId: false,
      isReadOnly: true,
      hasDefaultValue: false
    },
    {
      name: bTableName,
      type: bTableName,
      kind: "object",
      isRequired: true,
      isList: false,
      isUnique: false,
      isId: false,
      isReadOnly: true,
      hasDefaultValue: false,
      relationName: `${bTableName}To${manyTableName}`,
      relationFromFields: [`${bTableName}Id`],
      relationToFields: [getJoinIdName(bTableName, models)]
    }
  ];
};
var getJoinIdType = (typeName, models) => {
  const joinedModel = models.find((m) => m.name === typeName);
  if (!joinedModel) {
    throw new Error("Could not find referenced model of many-to-many relation");
  }
  const idField = joinedModel.fields.find((f) => f.isId);
  if (!idField)
    throw new Error("No ID field on referenced model of many-to-many relation");
  return idField.type;
};
var getJoinIdName = (typeName, models) => {
  const joinedModel = models.find((m) => m.name === typeName);
  if (!joinedModel) {
    throw new Error("Could not find referenced model of many-to-many relation");
  }
  const idField = joinedModel.fields.find((f) => f.isId);
  if (!idField)
    throw new Error("No ID field on referenced model of many-to-many relation");
  return idField.name;
};
var filterManyToManyRelationFields = (models) => {
  const fields = models.flatMap((model) => model.fields);
  const relationFields = fields.filter(
    (field) => !!field.relationName
  );
  const nonManyToManyRelationNames = relationFields.filter((field) => !field.isList).map((field) => field.relationName);
  const notManyToMany = new Set(nonManyToManyRelationNames);
  return relationFields.filter((field) => !notManyToMany.has(field.relationName));
};
var extractManyToManyModels = (models) => {
  const manyToManyFields = filterManyToManyRelationFields(models);
  if (!manyToManyFields.length)
    return [];
  return generateModels(manyToManyFields, models, []);
};

// src/util/generators/mysql.ts
var import_generator_helper = require("@prisma/generator-helper");
var mySqlImports = /* @__PURE__ */ new Set(["mysqlTable"]);
var drizzleImports = /* @__PURE__ */ new Set([]);
var prismaToDrizzleType = (type, colDbName, prismaEnum) => {
  if (prismaEnum) {
    mySqlImports.add("mysqlEnum");
    return `mysqlEnum('${colDbName}', [${prismaEnum.values.map((val) => `'${val.dbName ?? val.name}'`).join(", ")}])`;
  }
  switch (type.toLowerCase()) {
    case "bigint":
      mySqlImports.add("bigint");
      return `bigint('${colDbName}', { mode: 'bigint' })`;
    case "boolean":
      mySqlImports.add("boolean");
      return `boolean('${colDbName}')`;
    case "bytes":
      throw new import_generator_helper.GeneratorError("Drizzle ORM doesn't support binary data type for MySQL");
    case "datetime":
      mySqlImports.add("datetime");
      return `datetime('${colDbName}', { fsp: 3 })`;
    case "decimal":
      mySqlImports.add("decimal");
      return `decimal('${colDbName}', { precision: 65, scale: 30 })`;
    case "float":
      mySqlImports.add("double");
      return `double('${colDbName}')`;
    case "json":
      mySqlImports.add("json");
      return `json('${colDbName}')`;
    case "int":
      mySqlImports.add("int");
      return `int('${colDbName}')`;
    case "string":
      mySqlImports.add("varchar");
      return `varchar('${colDbName}', { length: 191 })`;
    default:
      return void 0;
  }
};
var addColumnModifiers = (field, column) => {
  if (field.isRequired)
    column = column + `.notNull()`;
  if (field.isId)
    column = column + `.primaryKey()`;
  if (field.isUnique)
    column = column + `.unique()`;
  if (field.default) {
    const defVal = field.default;
    switch (typeof defVal) {
      case "number":
      case "string":
      case "symbol":
      case "boolean":
        column = column + `.default(${JSON.stringify(defVal)})`;
        break;
      case "object":
        if (Array.isArray(defVal)) {
          column = column + `.default([${defVal.map((e) => JSON.stringify(e)).join(", ")}])`;
          break;
        }
        const value = defVal;
        if (value.name === "now") {
          column = column + `.default(sql\`CURRENT_TIMESTAMP\`)`;
          break;
        }
        if (value.name === "autoincrement") {
          column = column + `.autoincrement()`;
          break;
        }
        if (value.name === "dbgenerated") {
          column = column + `.default(sql\`${s(value.args[0], "`")}\`)`;
          drizzleImports.add("sql");
          break;
        }
        if (/^uuid\([0-9]*\)$/.test(value.name)) {
          column = column + `.default(sql\`uuid()\`)`;
          drizzleImports.add("sql");
          break;
        }
        const stringified = `${value.name}${value.args.length ? "(" + value.args.map((e) => String(e)).join(", ") + ")" : value.name.endsWith(")") ? "" : "()"}`;
        const sequel = `sql\`${s(stringified, "`")}\``;
        drizzleImports.add("sql");
        column = column + `.default(${sequel})`;
        break;
    }
  }
  return column;
};
var prismaToDrizzleColumn = (field, enums) => {
  const colDbName = s(field.dbName ?? field.name);
  let column = `	${field.name}: `;
  const drizzleType = prismaToDrizzleType(
    field.type,
    colDbName,
    field.kind === "enum" ? enums.find((e) => e.name === field.type) : void 0
  );
  if (!drizzleType)
    return void 0;
  column = column + drizzleType;
  column = addColumnModifiers(field, column);
  return column;
};
var generateMySqlSchema = (options) => {
  const { models, enums } = options.dmmf.datamodel;
  const clonedModels = JSON.parse(JSON.stringify(models));
  const manyToManyModels = extractManyToManyModels(clonedModels);
  const modelsWithImplicit = [...clonedModels, ...manyToManyModels];
  const tables = [];
  const rqb = [];
  for (const schemaTable of modelsWithImplicit) {
    const tableDbName = s(schemaTable.dbName ?? schemaTable.name);
    const columnFields = Object.fromEntries(
      schemaTable.fields.map((e) => [e.name, prismaToDrizzleColumn(e, enums)]).filter((e) => e[1] !== void 0)
    );
    const indexes = [];
    const relFields = schemaTable.fields.filter((field) => field.relationToFields && field.relationFromFields);
    const relations = relFields.map((field) => {
      if (!field?.relationFromFields?.length)
        return void 0;
      const fkeyName = s(`${schemaTable.dbName ?? schemaTable.name}_${field.dbName ?? field.name}_fkey`);
      let deleteAction;
      switch (field.relationOnDelete) {
        case void 0:
        case "Cascade":
          deleteAction = "cascade";
          break;
        case "SetNull":
          deleteAction = "set null";
          break;
        case "SetDefault":
          deleteAction = "set default";
          break;
        case "Restrict":
          deleteAction = "restrict";
          break;
        case "NoAction":
          deleteAction = "no action";
          break;
        default:
          throw new import_generator_helper.GeneratorError(`Unknown delete action on relation ${fkeyName}: ${field.relationOnDelete}`);
      }
      mySqlImports.add("foreignKey");
      return `	'${fkeyName}': foreignKey({
		name: '${fkeyName}',
		columns: [${field.relationFromFields.map((rel) => `${schemaTable.name}.${rel}`).join(", ")}],
		foreignColumns: [${field.relationToFields.map((rel) => `${field.type}.${rel}`).join(", ")}]
	})${deleteAction && deleteAction !== "no action" ? `
		.onDelete('${deleteAction}')` : ""}
		.onUpdate('cascade')`;
    }).filter((e) => e !== void 0);
    indexes.push(...relations);
    if (schemaTable.uniqueIndexes.length) {
      mySqlImports.add("uniqueIndex");
      const uniques = schemaTable.uniqueIndexes.map((idx) => {
        const idxName = s(idx.name ?? `${schemaTable.name}_${idx.fields.join("_")}_key`);
        return `	'${idx.name ? idxName : `${idxName.slice(0, idxName.length - 4)}_unique_idx`}': uniqueIndex('${idxName}')
		.on(${idx.fields.map((f) => `${schemaTable.name}.${f}`).join(", ")})`;
      });
      indexes.push(...uniques);
    }
    if (schemaTable.primaryKey) {
      mySqlImports.add("primaryKey");
      const pk = schemaTable.primaryKey;
      const pkName = s(pk.name ?? `${schemaTable.name}_cpk`);
      const pkField = `	'${pkName}': primaryKey({
		name: '${pkName}',
		columns: [${pk.fields.map((f) => `${schemaTable.name}.${f}`).join(", ")}]
	})`;
      indexes.push(pkField);
    }
    const table = `export const ${schemaTable.name} = mysqlTable('${tableDbName}', {
${Object.values(columnFields).join(",\n")}
}${indexes.length ? `, (${schemaTable.name}) => ({
${indexes.join(",\n")}
})` : ""});`;
    tables.push(table);
    if (!relFields.length)
      continue;
    drizzleImports.add("relations");
    const relationArgs = /* @__PURE__ */ new Set();
    const rqbFields = relFields.map((field) => {
      relationArgs.add(field.relationFromFields?.length ? "one" : "many");
      const relName = s(field.relationName ?? "");
      return `	${field.name}: ${field.relationFromFields?.length ? `one(${field.type}, {
		relationName: '${relName}',
		fields: [${field.relationFromFields.map((e) => `${schemaTable.name}.${e}`).join(", ")}],
		references: [${field.relationToFields.map((e) => `${field.type}.${e}`).join(", ")}]
	})` : `many(${field.type}, {
		relationName: '${relName}'
	})`}`;
    }).join(",\n");
    const argString = Array.from(relationArgs.values()).join(", ");
    const rqbRelation = `export const ${schemaTable.name}Relations = relations(${schemaTable.name}, ({ ${argString} }) => ({
${rqbFields}
}));`;
    rqb.push(rqbRelation);
  }
  const drizzleImportsArr = Array.from(drizzleImports.values()).sort((a, b) => a.localeCompare(b));
  const drizzleImportsStr = drizzleImportsArr.length ? `import { ${drizzleImportsArr.join(", ")} } from 'drizzle-orm'` : void 0;
  const mySqlImportsArr = Array.from(mySqlImports.values()).sort((a, b) => a.localeCompare(b));
  const mySqlImportsStr = mySqlImportsArr.length ? `import { ${mySqlImportsArr.join(", ")} } from 'drizzle-orm/mysql-core'` : void 0;
  let importsStr = [drizzleImportsStr, mySqlImportsStr].filter((e) => e !== void 0).join("\n");
  if (!importsStr.length)
    importsStr = void 0;
  const output = [importsStr, ...tables, ...rqb].filter((e) => e !== void 0).join("\n\n");
  return output;
};

// src/util/generators/pg.ts
var import_generator_helper2 = require("@prisma/generator-helper");
var pgImports = /* @__PURE__ */ new Set();
var drizzleImports2 = /* @__PURE__ */ new Set();
pgImports.add("pgTable");
var prismaToDrizzleType2 = (type, colDbName, defVal) => {
  switch (type.toLowerCase()) {
    case "bigint":
      pgImports.add("bigint");
      return `bigint('${colDbName}', { mode: 'bigint' })`;
    case "boolean":
      pgImports.add("boolean");
      return `boolean('${colDbName}')`;
    case "bytes":
      throw new import_generator_helper2.GeneratorError("Drizzle ORM doesn't support binary data type for PostgreSQL");
    case "datetime":
      pgImports.add("timestamp");
      return `timestamp('${colDbName}', { precision: 3 })`;
    case "decimal":
      pgImports.add("decimal");
      return `decimal('${colDbName}', { precision: 65, scale: 30 })`;
    case "float":
      pgImports.add("doublePrecision");
      return `doublePrecision('${colDbName}')`;
    case "json":
      pgImports.add("jsonb");
      return `jsonb('${colDbName}')`;
    case "int":
      if (defVal === "autoincrement") {
        pgImports.add("serial");
        return `serial('${colDbName}')`;
      }
      pgImports.add("integer");
      return `integer('${colDbName}')`;
    case "string":
      pgImports.add("text");
      return `text('${colDbName}')`;
    default:
      return void 0;
  }
};
var addColumnModifiers2 = (field, column) => {
  if (field.isList)
    column = column + `.array()`;
  if (field.isRequired)
    column = column + `.notNull()`;
  if (field.isId)
    column = column + `.primaryKey()`;
  if (field.isUnique)
    column = column + `.unique()`;
  if (field.default) {
    const defVal = field.default;
    switch (typeof defVal) {
      case "number":
      case "string":
      case "symbol":
      case "boolean":
        column = column + `.default(${JSON.stringify(defVal)})`;
        break;
      case "object":
        if (Array.isArray(defVal)) {
          column = column + `.default([${defVal.map((e) => JSON.stringify(e)).join(", ")}])`;
          break;
        }
        const value = defVal;
        if (value.name === "now") {
          column = column + `.defaultNow()`;
          break;
        }
        if (value.name === "autoincrement") {
          break;
        }
        if (value.name === "dbgenerated") {
          column = column + `.default(sql\`${s(value.args[0], "`")}\`)`;
          drizzleImports2.add("sql");
          break;
        }
        if (/^uuid\([0-9]*\)$/.test(value.name)) {
          column = column + `.default(sql\`uuid()\`)`;
          drizzleImports2.add("sql");
          break;
        }
        const stringified = `${value.name}${value.args.length ? "(" + value.args.map((e) => String(e)).join(", ") + ")" : value.name.endsWith(")") ? "" : "()"}`;
        const sequel = `sql\`${s(stringified, "`")}\``;
        drizzleImports2.add("sql");
        column = column + `.default(${sequel})`;
        break;
    }
  }
  return column;
};
var prismaToDrizzleColumn2 = (field) => {
  const colDbName = s(field.dbName ?? field.name);
  let column = `	${field.name}: `;
  if (field.kind === "enum") {
    column = column + `${field.type}('${colDbName}')`;
  } else {
    const defVal = typeof field.default === "object" && !Array.isArray(field.default) ? field.default.name : void 0;
    const drizzleType = prismaToDrizzleType2(field.type, colDbName, defVal);
    if (!drizzleType)
      return void 0;
    column = column + drizzleType;
  }
  column = addColumnModifiers2(field, column);
  return column;
};
var generatePgSchema = (options) => {
  const multiSchema =  options.otherGenerators.find(g => g.name === 'client')?.previewFeatures?.includes('multiSchema')

  const { models, enums } = options.dmmf.datamodel;

  const clonedModels = JSON.parse(JSON.stringify(models));
  const manyToManyModels = extractManyToManyModels(clonedModels);
  const modelsWithImplicit = [...clonedModels, ...manyToManyModels];

  const pgSchemas = [];
  const schemas = new Set();

  if(multiSchema) {
    pgImports.add("pgSchema");

    clonedModels.forEach(model => model.schema && schemas.add(model.schema))
    Array.from(schemas).forEach(schema => {
      pgSchemas.push(`const ${schema}Schema = pgSchema('${schema}')`)
    })
  }

  const pgEnums = [];
  for (const schemaEnum of enums) {
    if (!schemaEnum.values.length)
      continue;
    const enumDbName = s(schemaEnum.dbName ?? schemaEnum.name);
    pgImports.add("pgEnum");
    pgEnums.push(
      `export const ${schemaEnum.name} = pgEnum('${enumDbName}', [${schemaEnum.values.map((e) => `'${e.dbName ?? e.name}'`).join(", ")}])`
    );
  }
  const tables = [];
  const rqb = [];

  for (const schemaTable of modelsWithImplicit) {
    const tableDbName = s(schemaTable.dbName ?? schemaTable.name);
    const columnFields = Object.fromEntries(
      schemaTable.fields.map((e) => [e.name, prismaToDrizzleColumn2(e)]).filter((e) => e[1] !== void 0)
    );
    const indexes = [];
    const relFields = schemaTable.fields.filter((field) => field.relationToFields && field.relationFromFields);
    const relations = relFields.map((field) => {
      if (!field?.relationFromFields?.length)
        return void 0;
      const fkeyName = s(`${schemaTable.dbName ?? schemaTable.name}_${field.dbName ?? field.name}_fkey`);
      let deleteAction;
      switch (field.relationOnDelete) {
        case void 0:
        case "Cascade":
          deleteAction = "cascade";
          break;
        case "SetNull":
          deleteAction = "set null";
          break;
        case "SetDefault":
          deleteAction = "set default";
          break;
        case "Restrict":
          deleteAction = "restrict";
          break;
        case "NoAction":
          deleteAction = "no action";
          break;
        default:
          throw new import_generator_helper2.GeneratorError(`Unknown delete action on relation ${fkeyName}: ${field.relationOnDelete}`);
      }
      pgImports.add("foreignKey");
      return `	'${fkeyName}': foreignKey({
		name: '${fkeyName}',
		columns: [${field.relationFromFields.map((rel) => `${schemaTable.name}.${rel}`).join(", ")}],
		foreignColumns: [${field.relationToFields.map((rel) => `${field.type}.${rel}`).join(", ")}]
	})${deleteAction && deleteAction !== "no action" ? `
		.onDelete('${deleteAction}')` : ""}
		.onUpdate('cascade')`;
    }).filter((e) => e !== void 0);
    indexes.push(...relations);
    if (schemaTable.uniqueIndexes.length) {
      pgImports.add("uniqueIndex");
      const uniques = schemaTable.uniqueIndexes.map((idx) => {
        const idxName = s(idx.name ?? `${schemaTable.name}_${idx.fields.join("_")}_key`);
        return `	'${idx.name ? idxName : `${idxName.slice(0, idxName.length - 4)}_unique_idx`}': uniqueIndex('${idxName}')
		.on(${idx.fields.map((f) => `${schemaTable.name}.${f}`).join(", ")})`;
      });
      indexes.push(...uniques);
    }
    if (schemaTable.primaryKey) {
      pgImports.add("primaryKey");
      const pk = schemaTable.primaryKey;
      const pkName = s(pk.name ?? `${schemaTable.name}_cpk`);
      const pkField = `	'${pkName}': primaryKey({
		name: '${pkName}',
		columns: [${pk.fields.map((f) => `${schemaTable.name}.${f}`).join(", ")}]
	})`;
      indexes.push(pkField);
    }
    const table = `export const ${schemaTable.name} = ${
      multiSchema && schemas.has(schemaTable.schema) ? `${schemaTable.schema}Schema.table` : "pgTable"
    }('${tableDbName}', {
${Object.values(columnFields).join(",\n")}
}${indexes.length ? `, (${schemaTable.name}) => ({
${indexes.join(",\n")}
})` : ""});`;
    tables.push(table);
    if (!relFields.length)
      continue;
    drizzleImports2.add("relations");
    const relationArgs = /* @__PURE__ */ new Set();
    const rqbFields = relFields.map((field) => {
      relationArgs.add(field.relationFromFields?.length ? "one" : "many");
      const relName = s(field.relationName ?? "");
      return `	${field.name}: ${field.relationFromFields?.length ? `one(${field.type}, {
		relationName: '${relName}',
		fields: [${field.relationFromFields.map((e) => `${schemaTable.name}.${e}`).join(", ")}],
		references: [${field.relationToFields.map((e) => `${field.type}.${e}`).join(", ")}]
	})` : `many(${field.type}, {
		relationName: '${relName}'
	})`}`;
    }).join(",\n");
    const argString = Array.from(relationArgs.values()).join(", ");
    const rqbRelation = `export const ${schemaTable.name}Relations = relations(${schemaTable.name}, ({ ${argString} }) => ({
${rqbFields}
}));`;
    rqb.push(rqbRelation);
  }
  const drizzleImportsArr = Array.from(drizzleImports2.values()).sort((a, b) => a.localeCompare(b));
  const drizzleImportsStr = drizzleImportsArr.length ? `import { ${drizzleImportsArr.join(", ")} } from 'drizzle-orm'` : void 0;
  const pgImportsArr = Array.from(pgImports.values()).sort((a, b) => a.localeCompare(b));
  const pgImportsStr = pgImportsArr.length ? `import { ${pgImportsArr.join(", ")} } from 'drizzle-orm/pg-core'` : void 0;
  let importsStr = [drizzleImportsStr, pgImportsStr].filter((e) => e !== void 0).join("\n");
  if (!importsStr.length)
    importsStr = void 0;
  const output = [importsStr, ...pgSchemas, ...pgEnums, ...tables, ...rqb].filter((e) => e !== void 0).join("\n\n");
  return output;
};

// src/util/generators/sqlite.ts
var import_generator_helper3 = require("@prisma/generator-helper");
var sqliteImports = /* @__PURE__ */ new Set(["sqliteTable"]);
var drizzleImports3 = /* @__PURE__ */ new Set([]);
var prismaToDrizzleType3 = (type, colDbName) => {
  switch (type.toLowerCase()) {
    case "bigint":
      sqliteImports.add("int");
      return `int('${colDbName}')`;
    case "boolean":
      sqliteImports.add("int");
      return `int('${colDbName}', { mode: 'boolean' })`;
    case "bytes":
      sqliteImports.add("blob");
      return `blob('${colDbName}', { mode: 'buffer' })`;
    case "datetime":
      sqliteImports.add("numeric");
      return `numeric('${colDbName}')`;
    case "decimal":
      sqliteImports.add("numeric");
      return `numeric('${colDbName}')`;
    case "float":
      sqliteImports.add("real");
      return `real('${colDbName}')`;
    case "json":
      sqliteImports.add("text");
      return `text('${colDbName}', { mode: 'json' })`;
    case "int":
      sqliteImports.add("int");
      return `int('${colDbName}')`;
    case "string":
      sqliteImports.add("text");
      return `text('${colDbName}')`;
    default:
      return void 0;
  }
};
var addColumnModifiers3 = (field, column) => {
  if (field.isRequired)
    column = column + `.notNull()`;
  if (field.isId)
    column = column + `.primaryKey()`;
  if (field.isUnique)
    column = column + `.unique()`;
  if (field.default) {
    const defVal = field.default;
    switch (typeof defVal) {
      case "number":
      case "string":
      case "symbol":
      case "boolean":
        column = column + `.default(${JSON.stringify(defVal)})`;
        break;
      case "object":
        if (Array.isArray(defVal)) {
          column = column + `.default([${defVal.map((e) => JSON.stringify(e)).join(", ")}])`;
          break;
        }
        const value = defVal;
        if (value.name === "now") {
          column = column + `.default(sql\`DATE('now')\`)`;
          break;
        }
        if (value.name === "autoincrement") {
          break;
        }
        if (value.name === "dbgenerated") {
          column = column + `.default(sql\`${s(value.args[0], "`")}\`)`;
          drizzleImports3.add("sql");
          break;
        }
        if (/^uuid\([0-9]*\)$/.test(value.name)) {
          column = column + `.default(sql\`uuid()\`)`;
          drizzleImports3.add("sql");
          break;
        }
        const stringified = `${value.name}${value.args.length ? "(" + value.args.map((e) => String(e)).join(", ") + ")" : value.name.endsWith(")") ? "" : "()"}`;
        const sequel = `sql\`${s(stringified, "`")}\``;
        drizzleImports3.add("sql");
        column = column + `.default(${sequel})`;
        break;
    }
  }
  return column;
};
var prismaToDrizzleColumn3 = (field) => {
  const colDbName = s(field.dbName ?? field.name);
  let column = `	${field.name}: `;
  const drizzleType = prismaToDrizzleType3(field.type, colDbName);
  if (!drizzleType)
    return void 0;
  column = column + drizzleType;
  column = addColumnModifiers3(field, column);
  return column;
};
var generateSQLiteSchema = (options) => {
  const { models } = options.dmmf.datamodel;
  const clonedModels = JSON.parse(JSON.stringify(models));
  const manyToManyModels = extractManyToManyModels(clonedModels);
  const modelsWithImplicit = [...clonedModels, ...manyToManyModels];
  const tables = [];
  const rqb = [];
  for (const schemaTable of modelsWithImplicit) {
    const tableDbName = s(schemaTable.dbName ?? schemaTable.name);
    const columnFields = Object.fromEntries(
      schemaTable.fields.map((e) => [e.name, prismaToDrizzleColumn3(e)]).filter((e) => e[1] !== void 0)
    );
    const indexes = [];
    const relFields = schemaTable.fields.filter((field) => field.relationToFields && field.relationFromFields);
    const relations = relFields.map((field) => {
      if (!field?.relationFromFields?.length)
        return void 0;
      const fkeyName = s(`${schemaTable.dbName ?? schemaTable.name}_${field.dbName ?? field.name}_fkey`);
      let deleteAction;
      switch (field.relationOnDelete) {
        case void 0:
        case "Cascade":
          deleteAction = "cascade";
          break;
        case "SetNull":
          deleteAction = "set null";
          break;
        case "SetDefault":
          deleteAction = "set default";
          break;
        case "Restrict":
          deleteAction = "restrict";
          break;
        case "NoAction":
          deleteAction = "no action";
          break;
        default:
          throw new import_generator_helper3.GeneratorError(`Unknown delete action on relation ${fkeyName}: ${field.relationOnDelete}`);
      }
      sqliteImports.add("foreignKey");
      return `	'${fkeyName}': foreignKey({
		name: '${fkeyName}',
		columns: [${field.relationFromFields.map((rel) => `${schemaTable.name}.${rel}`).join(", ")}],
		foreignColumns: [${field.relationToFields.map((rel) => `${field.type}.${rel}`).join(", ")}]
	})${deleteAction && deleteAction !== "no action" ? `
		.onDelete('${deleteAction}')` : ""}
		.onUpdate('cascade')`;
    }).filter((e) => e !== void 0);
    indexes.push(...relations);
    if (schemaTable.uniqueIndexes.length) {
      sqliteImports.add("uniqueIndex");
      const uniques = schemaTable.uniqueIndexes.map((idx) => {
        const idxName = s(idx.name ?? `${schemaTable.name}_${idx.fields.join("_")}_key`);
        return `	'${idx.name ? idxName : `${idxName.slice(0, idxName.length - 4)}_unique_idx`}': uniqueIndex('${idxName}')
		.on(${idx.fields.map((f) => `${schemaTable.name}.${f}`).join(", ")})`;
      });
      indexes.push(...uniques);
    }
    if (schemaTable.primaryKey) {
      sqliteImports.add("primaryKey");
      const pk = schemaTable.primaryKey;
      const pkName = s(pk.name ?? `${schemaTable.name}_cpk`);
      const pkField = `	'${pkName}': primaryKey({
		name: '${pkName}',
		columns: [${pk.fields.map((f) => `${schemaTable.name}.${f}`).join(", ")}]
	})`;
      indexes.push(pkField);
    }
    const table = `export const ${schemaTable.name} = sqliteTable('${tableDbName}', {
${Object.values(columnFields).join(",\n")}
}${indexes.length ? `, (${schemaTable.name}) => ({
${indexes.join(",\n")}
})` : ""});`;
    tables.push(table);
    if (!relFields.length)
      continue;
    drizzleImports3.add("relations");
    const relationArgs = /* @__PURE__ */ new Set();
    const rqbFields = relFields.map((field) => {
      relationArgs.add(field.relationFromFields?.length ? "one" : "many");
      const relName = s(field.relationName ?? "");
      return `	${field.name}: ${field.relationFromFields?.length ? `one(${field.type}, {
		relationName: '${relName}',
		fields: [${field.relationFromFields.map((e) => `${schemaTable.name}.${e}`).join(", ")}],
		references: [${field.relationToFields.map((e) => `${field.type}.${e}`).join(", ")}]
	})` : `many(${field.type}, {
		relationName: '${relName}'
	})`}`;
    }).join(",\n");
    const argString = Array.from(relationArgs.values()).join(", ");
    const rqbRelation = `export const ${schemaTable.name}Relations = relations(${schemaTable.name}, ({ ${argString} }) => ({
${rqbFields}
}));`;
    rqb.push(rqbRelation);
  }
  const drizzleImportsArr = Array.from(drizzleImports3.values()).sort((a, b) => a.localeCompare(b));
  const drizzleImportsStr = drizzleImportsArr.length ? `import { ${drizzleImportsArr.join(", ")} } from 'drizzle-orm'` : void 0;
  const sqliteImportsArr = Array.from(sqliteImports.values()).sort((a, b) => a.localeCompare(b));
  const sqliteImportsStr = sqliteImportsArr.length ? `import { ${sqliteImportsArr.join(", ")} } from 'drizzle-orm/sqlite-core'` : void 0;
  let importsStr = [drizzleImportsStr, sqliteImportsStr].filter((e) => e !== void 0).join("\n");
  if (!importsStr.length)
    importsStr = void 0;
  const output = [importsStr, ...tables, ...rqb].filter((e) => e !== void 0).join("\n\n");
  return output;
};

// src/util/recursive-write/index.ts
var import_fs = __toESM(require("fs"));
var import_path = __toESM(require("path"));
var recursiveWrite = async (path2, content) => {
  import_fs.default.mkdirSync(import_path.default.dirname(path2), {
    recursive: true
  });
  import_fs.default.writeFileSync(path2, content);
};

// src/index.ts
var generator = (0, import_generator_helper4.generatorHandler)({
  onManifest() {
    return {
      version,
      defaultOutput: defaultPath,
      prettyName: generatorName
    };
  },
  onGenerate: async (options) => {
    const dbType = options.datasources[0]?.provider;
    let output;
    switch (dbType) {
      case "postgres":
      case "postgresql": {
        output = generatePgSchema(options);
        break;
      }
      case "mysql": {
        output = generateMySqlSchema(options);
        break;
      }
      case "sqlite": {
        output = generateSQLiteSchema(options);
        break;
      }
      case void 0:
        throw new import_generator_helper4.GeneratorError("Unable to determine database type.\nMake sure datasource.provider is specified.");
      default:
        throw new import_generator_helper4.GeneratorError(
          `Invalid database type for Drizzle schema generation: ${dbType}.
Supported database types: PostgreSQL, MySQL, SQLite.`
        );
    }
    const folderPath = import_path2.default.resolve(
      options.generator.output?.value ?? (!!options.generator.output?.fromEnvVar ? process.env[options.generator.output.fromEnvVar] ?? defaultPath : defaultPath)
    );
    const schemaPath = folderPath.endsWith(".ts") ? folderPath : import_path2.default.join(folderPath, "/schema.ts");
    recursiveWrite(schemaPath, output);
  }
});
var src_default = generator;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  generator
});
//# sourceMappingURL=index.js.map
