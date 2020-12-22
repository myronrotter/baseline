//import { compiler } from "circom";
const compile = require("circom").compiler;
//const snarkjs = require("snarkjs");
//import { groth16, powersOfTau, r1cs, wtns, zKey } from 'snarkjs';
import {
  IZKSnarkCircuitProvider,
  IZKSnarkCompilationArtifacts,
  IZKSnarkWitnessComputation,
  IZKSnarkTrustedSetupArtifacts,
} from ".";
import { ResolveCallback, VerificationKey } from "zokrates-js";

import * as path from "path";
import { readFileSync, createWriteStream } from "fs";
const fastFile = require("fastfile");
import { v4 as uuid } from "uuid";

export class SnarkjsService implements IZKSnarkCircuitProvider {
  private config: any;

  constructor(config) {
    this.config = config;
  }

  async compile(
    source: string,
    location: string
  ): Promise<IZKSnarkCompilationArtifacts> {
    const fileName = path.basename(source, ".circom");
    const options = {
      mainComponent: location,
      cSourceFile: await fastFile.createOverride(fileName + ".cpp"),
      dataFile: await fastFile.createOverride(fileName + ".dat"),
      wasmFile: await fastFile.createOverride(fileName + ".wasm"),
      watFile: await fastFile.createOverride(fileName + ".wat"),
      r1csFileName: fileName + ".r1cs",
      symWriteStream: createWriteStream(fileName + ".sym"),
    };
    await compile(source, options);

    await options.cSourceFile.close();
    await options.dataFile.close();
    await options.wasmFile.close();
    await options.watFile.close();
    let symDone = false;
    if (options.symWriteStream) {
      options.symWriteStream.on("finish", () => {
        symDone = true;
        finishIfDone();
      });
    } else {
      symDone = true;
    }
    function finishIfDone() {
      if (symDone) {
        setTimeout(() => {
          process.exit(0);
        }, 300);
      }
    }

    //console.log('Current directory: ' + process.cwd());
    const artifact: IZKSnarkCompilationArtifacts = {
      program: readFileSync("./noopAgreement.r1cs"),
      abi: ""
    }
    console.log(artifact);

    return artifact;
  }

  async computeWitness(
    artifacts: IZKSnarkCompilationArtifacts,
    args: any[]
  ): Promise<IZKSnarkWitnessComputation> {
    throw new Error("not implemented");
  }

  async exportVerifier(verifyingKey: VerificationKey): Promise<string> {
    throw new Error("not implemented");
  }

  async generateProof(
    circuit: any,
    witness: string,
    provingKey: any
  ): Promise<any> {
    throw new Error("not implemented");
  }

  async setup(
    artifacts: IZKSnarkCompilationArtifacts
  ): Promise<IZKSnarkTrustedSetupArtifacts> {
    throw new Error("not implemented");
  }
}

export const snarkjsServiceFactory = async (
  config?: any
): Promise<SnarkjsService> => {
  return new SnarkjsService(config);
};
