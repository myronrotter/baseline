import { zkSnarkCircuitProviderServiceFactory, zkSnarkCircuitProviderServiceSnarkJS } from '../src/index';

const noopAgreementCircuitPath = "../../lib/circuits/circom/noopAgreement.circom";

let provider;

describe('when the underlying snarkjs provider is available', () => {
  beforeEach(async () => {
    provider = await zkSnarkCircuitProviderServiceFactory(zkSnarkCircuitProviderServiceSnarkJS);
  });

  it('runs the noopAgreement circuit lifecycle successfully', async () => {
    const artifacts = await provider.compile(noopAgreementCircuitPath, "main");
  });
});
