import { describe, it, expect, beforeAll } from 'vitest';
import { setupTest } from '../testHelpers';
import type { trpcCaller } from '../testHelpers';
import type { Trip, User } from '../../db/schema';
import { env } from 'cloudflare:test';
import { Trip as TripClass } from '../../drizzle/methods/trip';
import { Pack as PackClass } from '../../drizzle/methods/pack';
import { User as UserClass } from '../../drizzle/methods/User';

describe('Trip Routes', () => {
  let caller: trpcCaller;
  const tripClass = new TripClass();
  const packClass = new PackClass();
  const userClass = new UserClass();

  let trip: Trip;
  let owner: User;

  beforeAll(async () => {
    caller = await setupTest(env);
    owner = await userClass.create({
      email: 'test@abc.com',
      name: 'test',
      username: 'test',
      password: 'test123',
    });
    const pack = await packClass.create({
      name: 'test',
      owner_id: owner.id,
      is_public: true,
    });
    trip = await tripClass.create({
      name: 'test',
      description: 'test',
      duration: '1h',
      weather: 'sunny',
      start_date: new Date().toDateString(),
      end_date: new Date().toDateString(),
      destination: 'test',
      owner_id: owner.id,
      pack_id: pack.id,
      is_public: true,
    });
  });

  describe('getPublicTrips', () => {
    it('should get public trips', async () => {
      const trips = await caller.getPublicTripsRoute({
        queryBy: 'Favorite',
      });
      expect(trips).toBeDefined();
      const isEveryTripPublic = trips.every((trip) => trip.is_public);
      expect(isEveryTripPublic).toBeTruthy();
    });
  });

  describe('Get trips by owner', () => {
    it('Get trips by owner', async () => {
      const ownerId = trip.owner_id;
      const [ownerTrip] = await caller.getTrips({
        owner_id: ownerId,
      });
      expect(ownerTrip?.owner_id).toEqual(ownerId);
    });
  });

  describe('editTrip', () => {
    it('should edit trip name', async () => {
      const nameToBeUpdated = 'updated trip';
      const updatedTrip = await caller.editTrip({
        ...trip,
        id: trip?.id,
        start_date: trip.start_date,
        end_date: trip.end_date,
        is_public: true,
        name: nameToBeUpdated,
      });
      expect(updatedTrip.name).toEqual(nameToBeUpdated);
    });
  });

  describe('addTrip', () => {
    it('should create a trip', async () => {
      const { id, ...partialTrip } = trip;
      const input = {
        ...partialTrip,
        geoJSON: {
          type: 'FeatureCollection' as const,
          features: [],
        },
      };

      const createdTrip = await caller.addTrip(input);
      expect(createdTrip).toBeDefined();
    });
  });

  describe('Delete trip', () => {
    it('should delete trip by id', async () => {
      const response = await caller.deleteTrip({
        tripId: trip.id,
      });
      expect(response).toEqual('trip was deleted successfully');
    });
  });
});