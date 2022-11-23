import { Advert, CreateAdvertInput } from '../../../graphql/models';

export default function mapAdvertToCreateInput(
    advert: Advert,
    version: number | undefined | null = 0,
): CreateAdvertInput {
    const { createdAt, updatedAt, ...createAdvertInput } = { ...advert };
    const input = createAdvertInput as CreateAdvertInput;
    input.version = (version ?? 0) + 1;
    input.conditionValue = input.condition;

    return input;
}
