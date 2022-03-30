const assert = require('assert');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../src/app');
const { stationData } = require('../mock-data');
const HttpStatus = require('../../src/api/utils/httpStatusCodes');

const Station = mongoose.model('station');

describe('Station Controller', () => {
  describe('POST request to /api/stations', () => {
    it('should add a new station record to the database', (done) => {
      Station.count().then((count) => {
        request(app)
          .post('/api/stations')
          .send(stationData)
          .end((err, res) => {
            // assert(res.body.en_name === stationData.en_name);
            console.log('From test1: ', res.body);
            Station.count().then((newCount) => {
              assert(count + 1 === newCount);
              done();
            });
          });
      });
    });

    xit('should prevent user from creating a new station that already exist', (done) => {
      const station = new Station(stationData);

      station.save().then(() => {
        request(app)
          .post('/api/stations')
          .send(stationData)
          .end((err, res) => {
            console.log('From TEST###', res.body);
            assert(
              res.body.error.en_name ===
                `'${stationData.en_name}' already exist`
            );
            done();
          });
      });
    });

    it('should return an error object with a 400 status code if user sends an invalid data', (done) => {
      request(app)
        .post('/api/stations')
        .send({})
        .end((err, res) => {
          console.log('From test2: Error Type', typeof res.body.error);
          assert(typeof res.body.error === 'object');
          assert(res.body.error.status === HttpStatus.BAD_REQUEST);
          done();
        });
    });

    it('should prevent user from saving a station with blank or empty name field', (done) => {
      const invalidData = { ...stationData, en_name: '' };

      request(app)
        .post('/api/stations')
        .send(invalidData)
        .end((err, res) => {
          console.log('From test3: Error', res.body.error);
          assert(res.body.error.en_name === 'Station name is required');
          done();
        });
    });
  });

  describe('GET request', () => {
    it('to /api/stations/name should get a station by its name', (done) => {
      const station = new Station(stationData);

      station.save().then(() => {
        request(app)
          .get(`/api/stations/name/${station.en_name}`)
          .end((err, res) => {
            assert(res.body._id === station._id.toString());
            done();
          });
      });
    });
  });

  describe('PUT request to /api/stations/id', () => {
    it('should update a station record if the provided id exists', (done) => {
      const station = new Station(stationData);

      station.save().then(() => {
        request(app)
          .put(`/api/stations/${station.id}`)
          .send({ is_closed: true })
          .end(() => {
            Station.findOne({ _id: station.id }).then((updatedStation) => {
              assert(updatedStation.is_closed === true);
              done();
            });
          });
      });
    });

    it("should return a 404 not found error message if the provided id doesn't exist", (done) => {
      const invalidId = 4545;

      request(app)
        .put(`/api/stations/${invalidId}`)
        .send({ is_closed: true })
        .end((err, res) => {
          const { status, message } = res.body.error;
          assert(status === HttpStatus.NOT_FOUND);
          assert(message === `Station with id '${invalidId}' was not found.`);
          done();
        });
    });
  });

  describe('DELETE request to /api/stations/id', () => {
    it('should delete a station record if the provided id exists', (done) => {
      const station = new Station(stationData);

      station.save().then(() => {
        request(app)
          .delete(`/api/stations/${station.id}`)
          .end(() => {
            Station.findOne({ _id: station.id }).then((deletedStation) => {
              assert(deletedStation === null);
              done();
            });
          });
      });
    });

    it("should return a success message after deleting a station's record", (done) => {
      const station = new Station(stationData);

      station.save().then(() => {
        request(app)
          .delete(`/api/stations/${station.id}`)
          .end((err, res) => {
            assert(
              res.text === `${station.en_name} station was deleted successfuly`
            );
            done();
          });
      });
    });

    it("should return a 404 not found error message if the provided id doesn't exist", (done) => {
      const invalidId = 4545;

      request(app)
        .delete(`/api/stations/${invalidId}`)
        .end((err, res) => {
          const { status, message } = res.body.error;
          assert(status === 404);
          assert(message === `Station with id '${invalidId}' was not found.`);
          done();
        });
    });
  });
});
